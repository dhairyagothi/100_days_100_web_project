// --- BINDINGS & APIS CONTEXTS ---
const codeArea = document.getElementById('code-textarea');
const lineTrack = document.getElementById('line-track');
const btnCreateRoom = document.getElementById('btn-create-room');
const txtLocalSignal = document.getElementById('txt-local-signal');
const btnCopySignal = document.getElementById('btn-copy-signal');
const txtRemoteSignal = document.getElementById('txt-remote-signal');
const btnConnect = document.getElementById('btn-connect');
const netStatusDot = document.getElementById('net-status-dot');
const netStatusText = document.getElementById('net-status-text');

let peerConnection = null;
let dataChannel = null;
let lastKnownValue = codeArea.value;

// STUN public infrastructure access routing (used to resolve connection path details)
const rtcConfig = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// --- 1. INITIALIZE PEER INFRASTRUCTURE CONNECTIONS ---
function initializePeer(isHost) {
    peerConnection = new RTCPeerConnection(rtcConfig);

    // Track network infrastructure path mappings
    peerConnection.onicecandidate = (event) => {
        if (!event.candidate) {
            // Once compilation finishes, output the final compressed connection token package
            txtLocalSignal.value = btoa(JSON.stringify(peerConnection.localDescription));
            btnCopySignal.disabled = false;
        }
    };

    if (isHost) {
        // Host initializes the synchronized data stream lanes
        dataChannel = peerConnection.createDataChannel("code-sync-stream");
        configureChannelEvents(dataChannel);
    } else {
        // Guest handles remote tracking lanes incoming route
        peerConnection.ondatachannel = (event) => {
            dataChannel = event.channel;
            configureChannelEvents(dataChannel);
        };
    }
}

// --- 2. SIGNALLING HANDSHAKE HOOKS ---
btnCreateRoom.addEventListener('click', async () => {
    initializePeer(true);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
});

btnConnect.addEventListener('click', async () => {
    const rawToken = txtRemoteSignal.value.trim();
    if (!rawToken) return alert("Please enter a valid handshake token!");

    const signalData = JSON.parse(atob(rawToken));

    if (!peerConnection) {
        // Guest context processing handshakes
        initializePeer(false);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(signalData));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
    } else {
        // Host confirming completion feedback loops
        await peerConnection.setRemoteDescription(new RTCSessionDescription(signalData));
    }
});

btnCopySignal.addEventListener('click', () => {
    txtLocalSignal.select();
    document.execCommand('copy');
    alert("Handshake token copied! Send this to your peer.");
});

// --- 3. CHANNEL EVENT MECHANICS ---
function configureChannelEvents(channel) {
    channel.onopen = () => {
        netStatusDot.classList.add('online');
        netStatusText.textContent = "Network Connected";
    };
    channel.onclose = () => {
        netStatusDot.classList.remove('online');
        netStatusText.textContent = "Network Offline";
    };

    // Process incoming character mutation packets cleanly
    channel.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        applyTextPatch(payload);
    };
}

// --- 4. ENGINE DIFF & PATCH STRATEGY ---
codeArea.addEventListener('input', (e) => {
    updateLineNumbers();

    if (!dataChannel || dataChannel.readyState !== "open") {
        lastKnownValue = codeArea.value;
        return;
    }

    const currentValue = codeArea.value;

    // Calculate simple diff offsets
    let startIdx = 0;
    while (startIdx < lastKnownValue.length && startIdx < currentValue.length && lastKnownValue[startIdx] === currentValue[startIdx]) {
        startIdx++;
    }

    let endOld = lastKnownValue.length - 1;
    let endNew = currentValue.length - 1;
    while (endOld >= startIdx && endNew >= startIdx && lastKnownValue[endOld] === currentValue[endNew]) {
        endOld--;
        endNew--;
    }

    const deletedChars = endOld - startIdx + 1;
    const insertedText = currentValue.substring(startIdx, endNew + 1);

    const editOperation = {
        index: startIdx,
        remove: deletedChars,
        insert: insertedText
    };

    dataChannel.send(JSON.stringify(editOperation));
    lastKnownValue = currentValue;
});

function applyTextPatch(op) {
    const startPos = codeArea.selectionStart;
    const endPos = codeArea.selectionEnd;
    const previousValue = codeArea.value;

    // Apply the localized edit string payload index modifications cleanly
    const updatedValue = previousValue.substring(0, op.index) +
        op.insert +
        previousValue.substring(op.index + op.remove);

    codeArea.value = updatedValue;
    lastKnownValue = updatedValue;

    // Fix and restore client cursor offsets positioning maps smoothly
    let cursorShift = op.insert.length - op.remove;
    if (startPos > op.index) {
        codeArea.setSelectionRange(startPos + cursorShift, endPos + cursorShift);
    } else {
        codeArea.setSelectionRange(startPos, endPos);
    }

    updateLineNumbers();
}

// Visual layout helper for tracking text rows counts
function updateLineNumbers() {
    const lines = codeArea.value.split('\n').length;
    let lineHTML = '';
    for (let i = 1; i <= lines; i++) {
        lineHTML += `<div>${i}</div>`;
    }
    lineTrack.innerHTML = lineHTML;
}
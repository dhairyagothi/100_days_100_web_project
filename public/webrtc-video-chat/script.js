document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const myIdInput = document.getElementById('my-id');
    const peerIdInput = document.getElementById('peer-id-input');
    const connectBtn = document.getElementById('connect-btn');
    const copyBtn = document.getElementById('copy-btn');
    const statusText = document.getElementById('connection-status');
    
    const localVideo = document.getElementById('local-video');
    const remoteVideo = document.getElementById('remote-video');
    const waitingMessage = document.getElementById('waiting-message');
    
    const toggleAudioBtn = document.getElementById('toggle-audio');
    const toggleVideoBtn = document.getElementById('toggle-video');
    const screenShareBtn = document.getElementById('screen-share');
    const endCallBtn = document.getElementById('end-call');

    // State Variables
    let peer = null;
    let localStream = null;
    let currentCall = null;
    let screenStream = null;
    let isAudioMuted = false;
    let isVideoHidden = false;
    let statsInterval = null;
    let previousBytes = 0;
    let previousTimestamp = 0;

    // Initialize PeerJS
    // PeerJS uses a free public cloud server by default when no config is passed
    peer = new Peer();

    peer.on('open', (id) => {
        myIdInput.value = id;
        console.log('My peer ID is: ' + id);
    });

    peer.on('error', (err) => {
        console.error(err);
        showStatus(`Error: ${err.type}`, 'text-danger');
    });

    // Initialize Local Media (Camera & Mic)
    async function startLocalMedia() {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideo.srcObject = localStream;
        } catch (err) {
            console.error('Failed to get local stream', err);
            showStatus('Camera/Mic permission denied', 'text-danger');
        }
    }

    // Handle Incoming Calls
    peer.on('call', (call) => {
        if (currentCall) {
            // Already in a call, reject or close current
            currentCall.close();
        }
        
        // Answer the call with our local stream
        call.answer(localStream);
        handleCall(call);
        showStatus('Call connected', 'text-success');
    });

    // Handle Call Object events
    function handleCall(call) {
        currentCall = call;
        
        call.on("stream", (remoteStream) => {
            waitingMessage.style.display = "none";
            remoteVideo.srcObject = remoteStream;

            if (call.peerConnection) {
                document.getElementById("network-quality").classList.remove("hidden");
                startNetworkMonitor(call.peerConnection);
            }
        });

        call.on('close', () => {
            endCurrentCall();
        });
        
        call.on('error', (err) => {
            console.error(err);
            endCurrentCall();
        });
    }

    // Make an Outgoing Call
    connectBtn.addEventListener('click', () => {
        const peerId = peerIdInput.value.trim();
        if (!peerId) {
            showStatus('Please enter a valid Peer ID', 'text-danger');
            return;
        }
        if (peerId === myIdInput.value) {
            showStatus('Cannot connect to yourself', 'text-danger');
            return;
        }

        showStatus('Connecting...', 'text-muted');
        const call = peer.call(peerId, localStream);
        handleCall(call);
        
        // Reset status if successful
        setTimeout(() => {
            if (currentCall && currentCall.open) {
                showStatus('Call connected', 'text-success');
            }
        }, 1500);
    });

    // End Call Handler
    function endCurrentCall() {
        stopNetworkMonitor();
        document.getElementById("network-quality").classList.add("hidden");
        if (currentCall) {
            currentCall.close();
            currentCall = null;
        }
        remoteVideo.srcObject = null;
        waitingMessage.style.display = 'flex';
        showStatus('Call ended', 'text-danger');
        
        // Revert to camera if screen sharing
        if (screenStream) {
            stopScreenShare();
        }
    }

    endCallBtn.addEventListener('click', endCurrentCall);

    // Audio Toggle
    toggleAudioBtn.addEventListener('click', () => {
        if (!localStream || !localStream.getAudioTracks()[0]) return;
        isAudioMuted = !isAudioMuted;
        localStream.getAudioTracks()[0].enabled = !isAudioMuted;
        
        toggleAudioBtn.innerHTML = isAudioMuted ? '<i class="fa-solid fa-microphone-slash"></i>' : '<i class="fa-solid fa-microphone"></i>';
        toggleAudioBtn.classList.toggle('active', isAudioMuted);
    });

    // Video Toggle
    toggleVideoBtn.addEventListener('click', () => {
        if (!localStream || !localStream.getVideoTracks()[0]) return;
        isVideoHidden = !isVideoHidden;
        localStream.getVideoTracks()[0].enabled = !isVideoHidden;
        
        toggleVideoBtn.innerHTML = isVideoHidden ? '<i class="fa-solid fa-video-slash"></i>' : '<i class="fa-solid fa-video"></i>';
        toggleVideoBtn.classList.toggle('active', isVideoHidden);
    });

    // Screen Share Toggle
    screenShareBtn.addEventListener('click', async () => {
        if (!screenStream) {
            try {
                screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                
                // Replace video track in current call
                if (currentCall) {
                    const videoTrack = screenStream.getVideoTracks()[0];
                    const sender = currentCall.peerConnection.getSenders().find(s => s.track.kind === 'video');
                    if (sender) {
                        sender.replaceTrack(videoTrack);
                    }
                }
                
                // Display local screen share (don't mirror it)
                localVideo.srcObject = screenStream;
                localVideo.style.transform = 'scaleX(1)';
                
                screenShareBtn.classList.add('active');

                // Listen for user stopping screen share via browser UI
                screenStream.getVideoTracks()[0].onended = () => {
                    stopScreenShare();
                };
            } catch (err) {
                console.error('Error sharing screen:', err);
            }
        } else {
            stopScreenShare();
        }
    });

    function startNetworkMonitor(pc) {
        stopNetworkMonitor();

        statsInterval = setInterval(async () => {
            await updateNetworkStats(pc);
        }, 1500);
    }

    function stopNetworkMonitor() {
        clearInterval(statsInterval);
        statsInterval = null;
    }

    async function updateNetworkStats(pc) {
        const stats = await pc.getStats();

        let bitrate = 0;
        let rtt = 0;
        let packetLoss = 0;
        let jitter = 0;
        let fps = 0;

        stats.forEach(report => {
            if (
                report.type === "candidate-pair" &&
                report.state === "succeeded"
            ) {
                rtt = (report.currentRoundTripTime || 0) * 1000;
            }

            if (
                report.type === "inbound-rtp" &&
                report.kind === "video"
            ) {
                fps = report.framesPerSecond || 0;
                jitter = (report.jitter || 0) * 1000;

                if (previousTimestamp) {
                    bitrate =
                        ((report.bytesReceived - previousBytes) * 8) /
                        ((report.timestamp - previousTimestamp) / 1000);

                    bitrate /= 1000;
                }

                previousBytes = report.bytesReceived;
                previousTimestamp = report.timestamp;

                const total =
                    report.packetsReceived + report.packetsLost;

                if (total > 0) {
                    packetLoss =
                        (report.packetsLost / total) * 100;
                }
            }
        });

        updateNetworkBadge({
            bitrate,
            rtt,
            packetLoss,
            jitter,
            fps
        });
    }

    function updateNetworkBadge(data) {
        const [icon, text] = getQuality(
            data.rtt,
            data.packetLoss
        );

        document.getElementById("quality-icon").textContent = icon;
        document.getElementById("quality-text").textContent = text;

        document.getElementById("bitrate").textContent =
            `${data.bitrate.toFixed(1)} kbps`;

        document.getElementById("rtt").textContent =
            `${data.rtt.toFixed(0)} ms`;

        document.getElementById("packet-loss").textContent =
            `${data.packetLoss.toFixed(1)} %`;

        document.getElementById("jitter").textContent =
            `${data.jitter.toFixed(1)} ms`;

        document.getElementById("fps").textContent =
        data.fps.toFixed(0);
    }

    function getQuality(rtt, loss) {
        if (rtt < 100 && loss < 1)
            return ["🟢", "Excellent"];

        if (rtt < 200 && loss < 3)
            return ["🟡", "Good"];

        if (rtt < 400 && loss < 8)
            return ["🟠", "Fair"];

        return ["🔴", "Poor"];
    }

    function stopScreenShare() {
        if (!screenStream) return;
        
        screenStream.getTracks().forEach(track => track.stop());
        screenStream = null;
        screenShareBtn.classList.remove('active');
        
        // Revert to camera stream
        localVideo.srcObject = localStream;
        localVideo.style.transform = 'scaleX(-1)';
        
        if (currentCall) {
            const videoTrack = localStream ? localStream.getVideoTracks()[0] : null;
            const sender = currentCall.peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
            if (sender) {
                sender.replaceTrack(videoTrack || null);
            }
        }
    }

    // Utility: Copy ID
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(myIdInput.value).then(() => {
            const icon = copyBtn.querySelector('i');
            icon.className = 'fa-solid fa-check';
            setTimeout(() => {
                icon.className = 'fa-regular fa-copy';
            }, 2000);
        });
    });

    // Utility: Update Status text
    function showStatus(msg, className) {
        statusText.textContent = msg;
        statusText.className = `status-text ${className}`;
    }

    // Start
    startLocalMedia();
});

var logDiv = document.getElementById('statusLog');
var philStates = ["Thinking", "Thinking", "Thinking", "Thinking", "Thinking"];
var forks = [true, true, true, true, true]; // true = fork is free on table
var simStarted    = false;
var deadlockShown = false;

function addLog(msg) {
    logDiv.innerHTML = msg + '<br>' + logDiv.innerHTML;
}

function updateUI(id, cssClass, label) {
    var el = document.getElementById('p' + id);
    if (el) {
        el.className = 'phil ' + cssClass;
        el.innerHTML = 'P' + id + '<br>' + label;
    }
}

function tryPickupForks(id) {
    var left  = (id + 4) % 5;
var right = id;
    var deadlockMode = document.getElementById('deadlockMode').checked;

    // ── DEADLOCK MODE LOGIC ──
    if (deadlockMode) {
        // If the philosopher hasn't picked up their left fork yet, try to grab it
        if (forks[left] === true) {
            forks[left] = false;
            document.getElementById('f' + left).className = 'fork held';
            addLog('P' + id + ' grabbed left fork F' + left + ', waiting for F' + right + '...');
            
            // Check right away if this action completed a circular deadlock ring
            checkDeadlockCondition();
        }
        // In deadlock mode, they grab one fork and wait indefinitely, never succeeding to eat
        return false;
    }

    // ── NORMAL MODE LOGIC (Resource Hierarchy Arbitration) ──
    var firstFork, secondFork;
    if (id === 4) {
        firstFork  = right; // Asymmetric allocation to break circular wait
        secondFork = left;
    } else {
        firstFork  = left;
        secondFork = right;
    }

    // Atomic double-fork verification
    if (forks[firstFork] === true && forks[secondFork] === true) {
        forks[firstFork]  = false;
        forks[secondFork] = false;
        document.getElementById('f' + firstFork).className  = 'fork held';
        document.getElementById('f' + secondFork).className = 'fork held';
        return true;
    }
    return false;
}

function releaseForks(id) {
    var left  = (id + 4) % 5;
    var right = id;
    forks[left]  = true;
    forks[right] = true;
    document.getElementById('f' + left).className  = 'fork';
    document.getElementById('f' + right).className = 'fork';
}

function checkDeadlockCondition() {
    var heldForkCount = 0;

    // Count how many forks have been hoarded across the table
    for (var i = 0; i < 5; i++) {
        if (forks[i] === false) {
            heldForkCount++;
        }
    }

    // If all 5 forks are held by hungry philosophers, circular wait condition is met!
    if (heldForkCount === 5 && !deadlockShown) {
        deadlockShown = true;
        document.getElementById('alert').style.display = "block";
        addLog('>>> ⚠ DEADLOCK DETECTED! All philosophers are holding their left fork and waiting forever.');
    }
}

function processLife(id) {
    philStates[id] = "Thinking";
    updateUI(id, "thinking", "Think");
    addLog('P' + id + ' is thinking...');

    // Dynamic randomized thinking cycles (between 3 to 6 seconds)
    var thinkTime = 3000 + Math.floor(Math.random() * 3000);

    setTimeout(function() {
        philStates[id] = "Hungry";
        updateUI(id, "hungry", "Hungry");
        addLog('P' + id + ' is hungry, trying to get forks...');

        var retryTimer = setInterval(function() {
            // Safety fallback break conditional
            if (philStates[id] !== "Hungry") {
                clearInterval(retryTimer);
                return;
            }

            var gotForks = tryPickupForks(id);

            if (gotForks === true) {
                clearInterval(retryTimer);
                philStates[id] = "Eating";
                updateUI(id, "eating", "Eating");
                addLog('P' + id + ' is EATING! (fork F' + id + ' + fork F' + ((id + 1) % 5) + ')');

                // Eat for 4 seconds before returning forks safely
                setTimeout(function() {
                    releaseForks(id);
                    addLog('P' + id + ' finished eating, forks released.');
                    processLife(id);
                }, 4000);
            }
        }, 1000); // Poll fork availability every 1 second
    }, thinkTime);
}

function startSim() {
    if (simStarted) { 
        alert("Simulation is already running!"); 
        return; 
    }
    simStarted = true;
    addLog('--- Simulation Started ---');

    // Staggered initialization to make the UI smooth and clean
    for (var i = 0; i < 5; i++) {
        (function(id) {
            setTimeout(function() {
                processLife(id);
            }, id * 1200);
        })(i);
    }
}

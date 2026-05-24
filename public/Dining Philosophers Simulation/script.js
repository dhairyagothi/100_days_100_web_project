var logDiv = document.getElementById('statusLog');
var philStates = ["Thinking", "Thinking", "Thinking", "Thinking", "Thinking"];var forks = [true, true, true, true, true]; // true = fork is free on tablevar simStarted    = false;var deadlockShown = false;

function addLog(msg) {    logDiv.innerHTML = msg + '<br>' + logDiv.innerHTML;
}

function updateUI(id, cssClass, label) {    var el = document.getElementById('p' + id);    el.className = 'phil ' + cssClass;    el.innerHTML = 'P' + id + '<br>' + label;
}

function tryPickupForks(id) {    var left  = id;    var right = (id + 1) % 5;    var deadlockMode = document.getElementById('deadlockMode').checked;

    if (deadlockMode) {        if (forks[left] == true) {            forks[left] = false;            document.getElementById('f' + left).className = 'fork held';            addLog('P' + id + ' grabbed left fork F' + left + ', waiting for F' + right + '...');            checkDeadlockCondition();        }        return false;    }

    var firstFork, secondFork;    if (id == 4) {        firstFork  = right;        secondFork = left;    } else {        firstFork  = left;        secondFork = right;    }

    if (forks[firstFork] == true && forks[secondFork] == true) {        forks[firstFork]  = false;        forks[secondFork] = false;        document.getElementById('f' + firstFork).className  = 'fork held';        document.getElementById('f' + secondFork).className = 'fork held';        return true;    }
    return false;
}

function releaseForks(id) {    var left  = id;    var right = (id + 1) % 5;    forks[left]  = true;    forks[right] = true;    document.getElementById('f' + left).className  = 'fork';    document.getElementById('f' + right).className = 'fork';
}

function checkDeadlockCondition() {    var hungryCount    = 0;    var forksAvailable = 0;

    for (var i = 0; i < 5; i++) {        if (philStates[i] == "Hungry") hungryCount++;        if (forks[i] == true) forksAvailable++;    }

    if (hungryCount == 5 && forksAvailable == 0 && deadlockShown == false) {        deadlockShown = true;        document.getElementById('alert').style.display = "block";        addLog('>>> DEADLOCK! All philosophers waiting, all forks held.');    }
}

function processLife(id) {    philStates[id] = "Thinking";    updateUI(id, "thinking", "Think");    addLog('P' + id + ' is thinking...');

    var thinkTime = 8000 + Math.floor(Math.random() * 4000);

    setTimeout(function() {        philStates[id] = "Hungry";        updateUI(id, "hungry", "Hungry");        addLog('P' + id + ' is hungry, trying to get forks...');

        var retryTimer = setInterval(function() {            if (philStates[id] != "Hungry") {                clearInterval(retryTimer);                return;            }

            var gotForks = tryPickupForks(id);

            if (gotForks == true) {                clearInterval(retryTimer);                philStates[id] = "Eating";                updateUI(id, "eating", "Eating");                addLog('P' + id + ' is EATING! (fork F' + id + ' + fork F' + ((id + 1) % 5) + ')');

                setTimeout(function() {                    releaseForks(id);                    addLog('P' + id + ' finished eating, forks released.');                    processLife(id);                }, 10000);            }        }, 1500);    }, thinkTime);
}

function startSim() {    if (simStarted) { alert("Already running!"); return; }    simStarted = true;    addLog('--- Simulation Started ---');

    for (var i = 0; i < 5; i++) {        (function(id) {            setTimeout(function() {                processLife(id);            }, id * 2000);        })(i);    }
}
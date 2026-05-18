// JavaScript
// DYNAMIC RUNTIME MESSAGE TEMPLATES

const runtimeTemplates = {

    event: [

        "User interaction entered the event pipeline.",
        "Frontend listener detected interaction.",
        "Browser dispatched interaction event.",
        "JavaScript captured runtime interaction.",
        "Client-side interaction event initialized."

    ],

    state: [

        "Application state updated internally.",
        "Frontend memory synchronized successfully.",
        "Reactive state transition completed.",
        "Runtime state values recalculated.",
        "State manager committed latest update."

    ],

    dom: [

        "DOM reconciliation completed.",
        "Virtual UI tree synchronized.",
        "Browser structure updated dynamically.",
        "Frontend components synchronized.",
        "DOM mutation cycle completed."

    ],

    render: [

        "Frontend interface rerendered visually.",
        "Rendering engine painted latest interface.",
        "UI refresh cycle completed successfully.",
        "Frontend render pipeline completed.",
        "Browser rendered updated interface."

    ]

};

function getRandomRuntimeMessage(type){

    const messages = runtimeTemplates[type];

    return messages[
        Math.floor(Math.random() * messages.length)
    ];

}

// CENTRALIZED APPLICATION STATE

const appState = {

    theme: "dark",

    searchQuery: "",

    loading: false,

    interactions: 0,

    renderCycles: 0,

    domUpdates: 0

};

// DOM REFERENCE

const body = document.body;

const themeToggleBtn =
document.getElementById("themeToggleBtn");

const processBtn =
document.getElementById("processBtn");

const notificationBtn =
document.getElementById("notificationBtn");

const exploreBtn=document.getElementById("exploreBtn")

const runtimeLab=document.getElementById("runtimeLab")

const likeBtn =
document.getElementById("likeBtn");

const shareBtn =
document.getElementById("shareBtn");

const searchInput =
document.getElementById("searchInput");

const notificationText =
document.getElementById("notificationText");

const stateOutput =
document.getElementById("state-output");

const activityList =
document.getElementById("activityList");

const interactionCount =
document.getElementById("interactionCount");

const renderCount =
document.getElementById("renderCount");

const domCount =
document.getElementById("domCount");

const previousStateView =
document.getElementById("previousStateView");

const nextStateView =
document.getElementById("nextStateView");

const activeStateLabel =
document.getElementById("activeStateLabel");

const domStatus =
document.getElementById("domStatus");

const renderStatusText =
document.getElementById("renderStatusText");

const increaseFontBtn =
document.getElementById("increaseFontBtn");

const decreaseFontBtn =
document.getElementById("decreaseFontBtn");


// FONT SYSTEM


let currentFontSize = 16;

// RUNTIME NODES

const runtimeNodes = {

    event:
    document.getElementById("node-event"),

    state:
    document.getElementById("node-state"),

    dom:
    document.getElementById("node-dom"),

    render:
    document.getElementById("node-render")

};

// CORE FUNCTIONS

function updateStats(){

    interactionCount.textContent =
    appState.interactions;

    renderCount.textContent =
    appState.renderCycles;

    domCount.textContent =
    appState.domUpdates;

}



function addActivity(message){

    const li = document.createElement("li");

    const timestamp =
    new Date().toLocaleTimeString();

    li.textContent =
    `[${timestamp}] ${message}`;

    activityList.prepend(li);

}



function updateInspector(message){

    stateOutput.textContent = message;

}



function updateStateViews(previous,next){

    previousStateView.textContent =
    previous;

    nextStateView.textContent =
    next;

}



function resetRuntimeNodes(){

    Object.values(runtimeNodes).forEach(node=>{

        node.classList.remove(
            "active-runtime-node"
        );

    });

}



function animateRuntimeFlow(){

    resetRuntimeNodes();

    setTimeout(()=>{

        runtimeNodes.event.classList.add(
            "active-runtime-node"
        );

    },100);

    setTimeout(()=>{

        runtimeNodes.state.classList.add(
            "active-runtime-node"
        );

    },500);

    setTimeout(()=>{

        runtimeNodes.dom.classList.add(
            "active-runtime-node"
        );

    },900);

    setTimeout(()=>{

        runtimeNodes.render.classList.add(
            "active-runtime-node"
        );

    },1300);

    setTimeout(()=>{

        resetRuntimeNodes();

    },2200);

}



function increaseRuntimeMetrics(){

    appState.interactions++;

    appState.renderCycles++;

    appState.domUpdates += 7;

    updateStats();

}

// THEME TOGGLE

themeToggleBtn.addEventListener("click",()=>{

    const previousTheme =
    appState.theme;

    appState.theme =
    appState.theme === "dark"
    ? "light"
    : "dark";

    body.classList.toggle("light-mode");

    themeToggleBtn.textContent =
    appState.theme === "dark"
    ? "Light Mode"
    : "Dark Mode";

    activeStateLabel.textContent =
    `Theme: ${appState.theme}`;

    domStatus.textContent =
    "Theme synchronization completed";

    renderStatusText.textContent =
    "Theme rerender completed";

    increaseRuntimeMetrics();

    animateRuntimeFlow();

    updateStateViews(
        `theme = ${previousTheme}`,
        `theme = ${appState.theme}`
    );

    addActivity(
        "Theme synchronized across frontend systems"
    );

    const eventMessage =
    getRandomRuntimeMessage("event");

    const stateMessage =
    getRandomRuntimeMessage("state");

    const domMessage =
    getRandomRuntimeMessage("dom");

    const renderMessage =
    getRandomRuntimeMessage("render");

    updateInspector(`

${eventMessage}

STEP 1 → EVENT

Theme toggle interaction received.


${stateMessage}

STEP 2 → STATE

Application theme state updated internally.

theme:
${appState.theme}


${domMessage}

STEP 3 → DOM

Browser synchronized:
• navbar
• cards
• typography
• backgrounds
• colors


${renderMessage}

STEP 4 → RENDER

Frontend interface rerendered visually.

`);

});

// PROCESS REQUEST

processBtn.addEventListener("click",()=>{

    appState.loading = true;

    notificationText.textContent =
    "Async runtime processing initialized...";

    domStatus.textContent =
    "Loading state synchronized";

    renderStatusText.textContent =
    "Async runtime rendering";

    increaseRuntimeMetrics();

    animateRuntimeFlow();

    addActivity(
        "Async runtime processing initialized"
    );

    const eventMessage =
    getRandomRuntimeMessage("event");

    const stateMessage =
    getRandomRuntimeMessage("state");

    const domMessage =
    getRandomRuntimeMessage("dom");

    const renderMessage =
    getRandomRuntimeMessage("render");

    updateInspector(`

${eventMessage}

STEP 1 → EVENT

Frontend received async request interaction.


${stateMessage}

STEP 2 → STATE

Loading state enabled internally.

loading:
true


${domMessage}

STEP 3 → DOM

Browser synchronized:
• loading systems
• runtime metrics
• inspector panel
• notification state


${renderMessage}

STEP 4 → RENDER

Async processing UI rendered.

`);

    setTimeout(()=>{

        appState.loading = false;

        notificationText.textContent =
        "Async runtime completed successfully.";

        domStatus.textContent =
        "Frontend systems synchronized";

        renderStatusText.textContent =
        "UI refresh completed";

        addActivity(
            "Async runtime completed successfully"
        );

    },2000);

});

// NOTIFICATION BUTTON

notificationBtn.addEventListener("click",()=>{

    notificationText.textContent =
    "Notification synchronized across systems.";

    domStatus.textContent =
    "Notification layer updated";

    renderStatusText.textContent =
    "Notification rendered";

    increaseRuntimeMetrics();

    animateRuntimeFlow();

    addActivity(
        "Notification synchronized across runtime systems"
    );

    const eventMessage =
    getRandomRuntimeMessage("event");

    const stateMessage =
    getRandomRuntimeMessage("state");

    const domMessage =
    getRandomRuntimeMessage("dom");

    const renderMessage =
    getRandomRuntimeMessage("render");

    updateInspector(`

${eventMessage}

STEP 1 → EVENT

Notification trigger interaction received.


${stateMessage}

STEP 2 → STATE

Notification state updated internally.

notification:
active


${domMessage}

STEP 3 → DOM

Browser synchronized:
• notification panel
• runtime timeline
• inspector state
• render counters


${renderMessage}

STEP 4 → RENDER

Notification interface rendered successfully.

`);

});

// LIKE ARTICLE

likeBtn.addEventListener("click",()=>{

    notificationText.textContent =
    "Article liked successfully.";

    renderStatusText.textContent =
    "Article reaction rendered";

    increaseRuntimeMetrics();

    animateRuntimeFlow();

    addActivity(
        "Article interaction synchronized"
    );

    const eventMessage =
    getRandomRuntimeMessage("event");

    const stateMessage =
    getRandomRuntimeMessage("state");

    const domMessage =
    getRandomRuntimeMessage("dom");

    const renderMessage =
    getRandomRuntimeMessage("render");

    updateInspector(`

${eventMessage}

STEP 1 → EVENT

Article reaction interaction detected.


${stateMessage}

STEP 2 → STATE

Frontend updated article reaction state.

reaction:
liked


${domMessage}

STEP 3 → DOM

Browser synchronized:
• article card
• reaction metrics
• interaction counters
• activity timeline


${renderMessage}

STEP 4 → RENDER

Updated article reaction rendered visually.

`);

});

// SHARE ARTICLE

shareBtn.addEventListener("click",()=>{

    notificationText.textContent =
    "Article sharing workflow completed.";

    renderStatusText.textContent =
    "Sharing interface rendered";

    increaseRuntimeMetrics();

    animateRuntimeFlow();

    addActivity(
        "Article sharing synchronized"
    );

    const eventMessage =
    getRandomRuntimeMessage("event");

    const stateMessage =
    getRandomRuntimeMessage("state");

    const domMessage =
    getRandomRuntimeMessage("dom");

    const renderMessage =
    getRandomRuntimeMessage("render");

    updateInspector(`

${eventMessage}

STEP 1 → EVENT

Share interaction dispatched.


${stateMessage}

STEP 2 → STATE

Frontend updated sharing workflow state.

shareStatus:
processed


${domMessage}

STEP 3 → DOM

Browser synchronized:
• sharing interface
• activity systems
• runtime metrics
• notification layers


${renderMessage}

STEP 4 → RENDER

Share workflow rendered successfully.

`);

});

// SEARCH SYSTEM

searchInput.addEventListener("input",(e)=>{

    appState.searchQuery = e.target.value;

    domStatus.textContent =
    "Search filtering synchronized";

    renderStatusText.textContent =
    "Search results rerendered";

    increaseRuntimeMetrics();

    animateRuntimeFlow();

    addActivity(
        `Search runtime updated for "${appState.searchQuery}"`
    );

});

// FONT INCREASE


increaseFontBtn.addEventListener("click",()=>{

    currentFontSize++;

    document.body.style.fontSize =
    `${currentFontSize}px`;

    activeStateLabel.textContent =
    `Font Size: ${currentFontSize}px`;

    domStatus.textContent =
    "Typography synchronized";

    renderStatusText.textContent =
    "Accessibility scaling rerendered";

    increaseRuntimeMetrics();

    animateRuntimeFlow();

    addActivity(
        "Global font scaling synchronized"
    );

    const eventMessage =
    getRandomRuntimeMessage("event");

    const stateMessage =
    getRandomRuntimeMessage("state");

    const domMessage =
    getRandomRuntimeMessage("dom");

    const renderMessage =
    getRandomRuntimeMessage("render");

    updateInspector(`

${eventMessage}

STEP 1 → EVENT

Accessibility interaction received.


${stateMessage}

STEP 2 → STATE

Frontend updated font scaling state.

fontSize:
${currentFontSize}px


${domMessage}

STEP 3 → DOM

Browser synchronized:
• headings
• cards
• typography
• layouts


${renderMessage}

STEP 4 → RENDER

Accessibility scaling rendered successfully.

`);

});


// FONT DECREASE

decreaseFontBtn.addEventListener("click",()=>{

    currentFontSize--;

    document.body.style.fontSize =
    `${currentFontSize}px`;

    activeStateLabel.textContent =
    `Font Size: ${currentFontSize}px`;

    domStatus.textContent =
    "Typography synchronized";

    renderStatusText.textContent =
    "Accessibility scaling rerendered";

    increaseRuntimeMetrics();

    animateRuntimeFlow();

    addActivity(
        "Font scaling reduced globally"
    );

});


exploreBtn.addEventListener("click",()=>{
    runtimeLab.scrollIntoView({
        behavior: "smooth"
    });
});


// INITIALIZE

updateStats();

updateInspector(`

Frontend runtime initialized successfully.

Interact with the platform to visualize:

• Events
• State updates
• DOM synchronization
• Render cycles

`);
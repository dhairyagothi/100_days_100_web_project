const pollOptionsContainer = document.getElementById("poll-options-container");
const totalVotesLabel = document
  .getElementById("total-votes-label")
  .querySelector("strong");
const statusMessage = document.getElementById("status-message");
const resetPollBtn = document.getElementById("reset-poll-btn");

// Structured object schema maintaining individual answer choice states
let pollDataModelStore = {
  javascript: 14,
  python: 8,
  rust: 5,
  go: 3,
};

let trackingUserSubmissionFlag = false;

function computeAndRenderPercentages() {
  // 1. Calculate historical total baseline aggregate metrics
  const overallTotalVotes = Object.values(pollDataModelStore).reduce(
    (accumulator, count) => accumulator + count,
    0,
  );
  totalVotesLabel.textContent = overallTotalVotes;

  // 2. Loop through options dynamically calculating and applying percentages
  const optionRowsList = document.querySelectorAll(".poll-option-row");
  optionRowsList.forEach((rowElement) => {
    const matchingKey = rowElement.dataset.option;
    const particularVoteCount = pollDataModelStore[matchingKey] || 0;

    // Prevent mathematical division errors when total pool equals zero
    const computedRatioPercent =
      overallTotalVotes > 0
        ? Math.round((particularVoteCount / overallTotalVotes) * 100)
        : 0;

    // Target matching internal sub-nodes
    const fillTrack = rowElement.querySelector(".percentage-fill-track");
    const countDisplay = rowElement.querySelector(".count-val");
    const percentDisplay = rowElement.querySelector(".percent-val");

    // Apply style changes and metrics to sub-nodes
    fillTrack.style.width = `${computedRatioPercent}%`;
    countDisplay.textContent = `${particularVoteCount} vote${particularVoteCount === 1 ? "" : "s"}`;
    percentDisplay.textContent = `${computedRatioPercent}%`;

    // If user already submitted, explicitly append completion styles
    if (trackingUserSubmissionFlag) {
      rowElement.classList.add("has-voted");
    } else {
      rowElement.classList.remove("has-voted");
    }
  });
}

function handleOptionSelection(clickEvent) {
  const pinpointTargetRow = clickEvent.currentTarget;
  const designatedSelectionKey = pinpointTargetRow.dataset.option;

  // Boundary block preventing dual voting routines inside active sessions
  if (trackingUserSubmissionFlag) return;

  // Increment selection values inside data object variables
  pollDataModelStore[designatedSelectionKey]++;
  trackingUserSubmissionFlag = true;

  // Update state cache maps in browser storage layers
  localStorage.setItem("quick_poll_user_voted", "true");
  localStorage.setItem(
    "quick_poll_data_snapshot",
    JSON.stringify(pollDataModelStore),
  );
  localStorage.setItem("quick_poll_chosen_key", designatedSelectionKey);

  // Apply specific selection visuals
  pinpointTargetRow.classList.add("user-selection");
  statusMessage.textContent =
    "Thank you! Your vote has been recorded securely.";
  statusMessage.classList.add("success-glow");
  resetPollBtn.style.display = "block";

  computeAndRenderPercentages();
}

function clearPollCacheSession() {
  // Clear user tracking keys from LocalStorage references
  localStorage.removeItem("quick_poll_user_voted");
  localStorage.removeItem("quick_poll_chosen_key");

  trackingUserSubmissionFlag = false;

  // Strip out active interaction classes from option rows
  const optionRowsList = document.querySelectorAll(".poll-option-row");
  optionRowsList.forEach((row) => {
    row.classList.remove("has-voted", "user-selection");
  });

  statusMessage.textContent =
    "Select an option above to cast your vote anonymously!";
  statusMessage.classList.remove("success-glow");
  resetPollBtn.style.display = "none";

  computeAndRenderPercentages();
}

function establishInitialPollState() {
  const historicalDataSnapshot = localStorage.getItem(
    "quick_poll_data_snapshot",
  );
  const userHasVotedBeforeToken = localStorage.getItem("quick_poll_user_voted");
  const cachedSelectionKey = localStorage.getItem("quick_poll_chosen_key");

  if (historicalDataSnapshot) {
    pollDataModelStore = JSON.parse(historicalDataSnapshot);
  }

  if (userHasVotedBeforeToken === "true") {
    trackingUserSubmissionFlag = true;
    resetPollBtn.style.display = "block";
    statusMessage.textContent =
      "You have already submitted a vote for this poll panel.";
    statusMessage.classList.add("success-glow");

    // Locate and re-apply selection highlighting onto matching nodes
    if (cachedSelectionKey) {
      const chosenNode = document.querySelector(
        `.poll-option-row[data-option="${cachedSelectionKey}"]`,
      );
      if (chosenNode) chosenNode.classList.add("user-selection");
    }
  }

  computeAndRenderPercentages();
}

// Bind interaction click listeners to items
document.querySelectorAll(".poll-option-row").forEach((rowNode) => {
  rowNode.addEventListener("click", handleOptionSelection);
});

resetPollBtn.addEventListener("click", clearPollCacheSession);

// Run initial system initialization
establishInitialPollState();

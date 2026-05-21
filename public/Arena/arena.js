const checks = document.querySelectorAll(".check");

const progressFill =
  document.getElementById("progressFill");

const progressText =
  document.getElementById("progressText");

const completeBtn =
  document.querySelector(".complete-btn");

function updateProgress() {

  const checkedCount =
    document.querySelectorAll(".check:checked").length;

  const totalChecks = checks.length;

  const progress =
    (checkedCount / totalChecks) * 100;

  progressFill.style.width =
    progress + "%";

  progressText.innerText =
    Math.round(progress) + "%";

  localStorage.setItem(
    "arenaProgress",
    progress
  );

}

function saveObjectives() {

  const checkedStates = [];

  checks.forEach((check) => {
    checkedStates.push(check.checked);
  });

  localStorage.setItem(
    "arenaObjectives",
    JSON.stringify(checkedStates)
  );

}

function loadObjectives() {

  const savedObjectives =
    JSON.parse(localStorage.getItem("arenaObjectives"));

  if (savedObjectives) {

    checks.forEach((check, index) => {

      check.checked =
        savedObjectives[index];

    });

  }

  updateProgress();

}

checks.forEach((check) => {

  check.addEventListener("change", () => {

    updateProgress();

    saveObjectives();

  });

});

completeBtn.addEventListener("click", () => {

  const checkedCount =
    document.querySelectorAll(".check:checked").length;

  const totalChecks = checks.length;

  if (checkedCount !== totalChecks) {

    alert(
      "Complete all objectives before finishing the challenge!"
    );

    return;

  }

  completeBtn.innerText =
    "Challenge Completed 🎉";

  completeBtn.style.background =
    "#00c896";

  completeBtn.disabled = true;

  localStorage.setItem(
    "arenaCompleted",
    "true"
  );

  alert(
    "Congratulations! You completed the UI Arena Challenge 🚀"
  );

});

function loadCompletionState() {

  const completed =
    localStorage.getItem("arenaCompleted");

  if (completed === "true") {

    completeBtn.innerText =
      "Challenge Completed 🎉";

    completeBtn.style.background =
      "#00c896";

    completeBtn.disabled = true;

  }

}

loadObjectives();

loadCompletionState();
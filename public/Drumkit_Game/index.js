var numberOfDrumButtons = document.querySelectorAll(".drum").length;

// Detect mouse clicks
for (var i = 0; i < numberOfDrumButtons; i++) {

  document.querySelectorAll(".drum")[i].addEventListener("click", function () {

    var buttonInnerHTML = this.innerHTML.trim();

    makeSound(buttonInnerHTML);
    buttonAnimation(buttonInnerHTML);

  });

}

// Detect keyboard presses
document.addEventListener("keypress", function (event) {

  makeSound(event.key);
  buttonAnimation(event.key);

});

// Play sounds
function makeSound(key) {

  switch (key) {

    case "do":
      new Audio("sounds/tom-1.mp3").play();
      break;

    case "re":
      new Audio("sounds/tom-2.mp3").play();
      break;

    case "mi":
      new Audio("sounds/tom-3.mp3").play();
      break;

    case "fa":
      new Audio("sounds/tom-4.mp3").play();
      break;

    case "so":
      new Audio("sounds/snare.mp3").play();
      break;

    case "la":
      new Audio("sounds/crash.mp3").play();
      break;

    case "ti":
      new Audio("sounds/kick-bass.mp3").play();
      break;

    default:
      console.log("Invalid key:", key);
  }
}

// Button animation
function buttonAnimation(currentKey) {

  var activeButton = document.querySelector("." + currentKey);

  // Prevent null errors
  if (!activeButton) {
    return;
  }

  activeButton.classList.add("pressed");

  setTimeout(function () {
    activeButton.classList.remove("pressed");
  }, 100);

}
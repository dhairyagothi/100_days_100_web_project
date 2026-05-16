var numberOfDrumButtons = document.querySelectorAll(".drum").length;

for (var i = 0; i < numberOfDrumButtons; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function () {
    var buttonMap = {
      Z: "do",
      X: "re",
      C: "mi",
      V: "fa",
      B: "so",
      N: "la",
      M: "ti",
    };

    var mappedButton = buttonMap[this.innerHTML];

    makeSound(mappedButton);

    buttonAnimation(mappedButton);
  });
}

document.addEventListener("keypress", function (event) {
  var keyMap = {
    z: "do",
    x: "re",
    c: "mi",
    v: "fa",
    b: "so",
    n: "la",
    m: "ti",
  };

  var mappedKey = keyMap[event.key.toLowerCase()];

  if (mappedKey) {
    makeSound(mappedKey);
    buttonAnimation(mappedKey);
  }
});

function makeSound(key) {
  switch (key) {
    case "do":
      var tom1 = new Audio("sounds/tom-1.mp3");
      tom1.play();
      break;

    case "re":
      var tom2 = new Audio("sounds/tom-2.mp3");
      tom2.play();
      break;

    case "mi":
      var tom3 = new Audio("sounds/tom-3.mp3");
      tom3.play();
      break;

    case "fa":
      var tom4 = new Audio("sounds/tom-4.mp3");
      tom4.play();
      break;

    case "so":
      var snare = new Audio("sounds/snare.mp3");
      snare.play();
      break;

    case "la":
      var crash = new Audio("sounds/crash.mp3");
      crash.play();
      break;

    case "ti":
      var kick = new Audio("sounds/kick-bass.mp3");
      kick.play();
      break;

    default:
      console.log(key);
  }
}

function buttonAnimation(currentKey) {
  var buttonMap = {
    do: ".w",
    re: ".a",
    mi: ".s",
    fa: ".d",
    so: ".j",
    la: ".k",
    ti: ".l",
  };

  var activeButton = document.querySelector(buttonMap[currentKey]);

  if (activeButton) {
    activeButton.classList.add("pressed");

    setTimeout(function () {
      activeButton.classList.remove("pressed");
    }, 100);
  }
}

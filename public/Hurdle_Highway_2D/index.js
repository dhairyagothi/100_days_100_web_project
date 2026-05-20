let intro2 = document.getElementById("intro2");
let playbutton = document.getElementById("playbtn");
let gameStarted = false;
let mainMenu = document.getElementById("mainMenu");
let gametimer = document.getElementById("gametimer");
let gametimercont = document.getElementById("gametimercont");
let timecount = 3;
let timeraud = document.getElementById("timeraud");
let carmoveaud = document.getElementById("carmoveaud");
let hornaud = document.getElementById("hornaud");
let crashaud = document.getElementById("crashaud");

document.addEventListener("DOMContentLoaded", function introsound() {
  intro2.play();
});

playbutton.addEventListener("click", function maingame() {
  gameStarted = true;
  mainMenu.style.visibility = "hidden";
  timerf();
  setTimeout(newgame, 3000);
  intro2.pause();
});

let timerf = function timer() {
  timeraud.play();
  gametimercont.style.visibility = "visible";
  let cleartimer = setInterval(() => {
    timecount--;
    gametimer.innerHTML = timecount;
    if (timecount == 3) {
      gametimercont.style.backgroundColor = "#E53935";
    }
    if (timecount == 2) {
      gametimercont.style.backgroundColor = "#FBC02D";
    }

    if (timecount == 1) {
      gametimercont.style.backgroundColor = "#43A047";
    }
    if (timecount == 0) {
      gametimercont.style.visibility = "hidden";
      timerf = null;
      clearInterval(cleartimer);
    }
  }, 1000);
};

let newgame = function startgame() {
  document.addEventListener("keydown", function horn(e) {
    if (e.keyCode == 72) {
      hornaud.play();
    }
  });
  carmoveaud.play();
  let car = document.getElementById("car");
  let margin = 70;
  let Lpos = 520;

  function move(e) {
    // console.log(e.keyCode);
    if (e.keyCode == 37) {
      Lpos -= margin;
    } else if (e.keyCode == 39) {
      Lpos += margin;
    }
    if (Lpos < 260) {
      Lpos = 260;
    }
    if (Lpos > 788) {
      Lpos = 788;
    }
    // car.style.position = 'absolute';
    car.style.left = Lpos + "px";
    car.style.bottom = "0px";
    // setInterval(move,100);
  }
  document.addEventListener("keydown", move);

  //scoring logic

  let score = 0;
  let scoreb = document.getElementById("scorepara1");

  let scoref = () => {
    score++;
    console.log(score);
    scoreb.innerHTML = "SCORE - " + score;
  };
  let clearScore = setInterval(scoref, 1000);

  //Variable speed logic

  let speedb = document.getElementById("scorepara2");
  let scoreg = document.getElementById("scorepara");
  let gameover = document.getElementById("gameover");

  let speed1 = () => {
    speedb.innerHTML = "SPEED - 160 KM/H";
  };
  let clearspeed1 = setInterval(speed1, 1900);

  let speed2 = () => {
    speedb.innerHTML = "SPEED - 120 KM/H";
  };
  let clearspeed2 = setInterval(speed2, 5000);

  let speed3 = () => {
    speedb.innerHTML = "SPEED - 140 KM/H";
  };
  let clearspeed3 = setInterval(speed3, 3200);

  let speed4 = () => {
    speedb.innerHTML = "SPEED - 150 KM/H";
  };
  let clearspeed4 = setInterval(speed4, 1500);

  let speed5 = () => {
    speedb.innerHTML = "SPEED - 110 KM/H";
  };
  let clearspeed5 = setInterval(speed5, 5500);

  //animations start here

  let obs1 = document.getElementById("obs1");
  
  //animation for obs1

  let f1 = function obsanimate1() {
    obs1.classList.remove("animateobs1");

    setTimeout(() => {
      obs1.classList.add("animateobs1");
    }, 1500);
  };

  //animation for obs2

  let obs2 = document.getElementById("obs2");

  let f2 = function obsanimate2() {
    obs2.classList.remove("animateobs2");

    setTimeout(() => {
      obs2.classList.add("animateobs2");
    }, 3500);
  };

  //animation for obs3

  let obs3 = document.getElementById("obs3");

  let f3 = function obsanimate3() {
    obs3.classList.remove("animateobs3");

    setTimeout(() => {
      obs3.classList.add("animateobs3");
    }, 5500);
  };

  //animation for obs4

  let obs4 = document.getElementById("obs4");

  let f4 = function obsanimate4() {
    obs4.classList.remove("animateobs4");

    setTimeout(() => {
      obs4.classList.add("animateobs4");
    }, 2500);
  };

  //animation for obs5

  let obs5 = document.getElementById("obs5");

  let f5 = function obsanimate5() {
    obs5.classList.remove("animateobs5");

    setTimeout(() => {
      obs5.classList.add("animateobs5");
    }, 3000);
  };

  //animation for obs6

  let obs6 = document.getElementById("obs6");
  let f6 = function obsanimate6() {
    obs6.classList.remove("animateobs6");
    setTimeout(() => {
      obs6.classList.add("animateobs6");
    }, 1500);
  };

  //animation for obs7

  let obs7 = document.getElementById("obs7");

  let f7 = function obsanimate7() {
    obs7.classList.remove("animateobs7");

    setTimeout(() => {
      obs7.classList.add("animateobs7");
    }, 5000);
  };

  //animation for obs8

  let obs8 = document.getElementById("obs8");
  let f8 = function obsanimate8() {
    obs8.classList.remove("animateobs8");
    setTimeout(() => {
      obs8.classList.add("animateobs8");
    }, 1500);
  };

  // animation for obs 9

  let obs9 = document.getElementById("obs9");

  let f9 = function obsanimate9() {
    obs9.classList.remove("animateobs9");

    setTimeout(() => {
      obs9.classList.add("animateobs9");
    }, 5500);
  };

  // animations
  obs1;
  f1();

  let clear1 = setInterval(() => {
    f1();
  }, 5000);

  // //obs2
  f2();

  let clear2 = setInterval(f2, 7000);

  // //obs3
  f3();

  let clear3 = setInterval(f3, 9000);

  // //obs4
  f4();

  let clear4 = setInterval(f4, 6000);

  // //obs5
  f5();

  let clear5 = setInterval(f5, 7000);

  //obs6

  f6();
  let clear6 = setInterval(f6, 3500);

  // //obs7
  f7();

  let clear7 = setInterval(f7, 9000);

  //obs8

  f8();
  let clear8 = setInterval(f8, 3500);

  // //obs9

  f9();

  let clear9 = setInterval(f9, 9500);

  //CAR CRASH LOGIC
  // crash function

  //obs1

  function crash(car, obs, func, clearInt, xThreshold = 60, yThreshold = 10) {
    let carY = parseInt(car.getBoundingClientRect().top);
    let obsY = Math.abs(parseInt(obs.getBoundingClientRect().top));
    let carX = parseInt(car.getBoundingClientRect().left);
    let obsX = parseInt(obs.getBoundingClientRect().left);
    let offsetY = Math.abs(obsY - carY);
    let offsetX = Math.abs(obsX - carX);
    if (offsetY < yThreshold && offsetX <= xThreshold) {
      carmoveaud.pause();
      crashaud.play();
      document.removeEventListener("keydown", move);
      func = null;
      f1 = null;
      f2 = null;
      f3 = null;
      f4 = null;
      f5 = null;
      f6 = null;
      f7 = null;
      f8 = null;
      f9 = null;
      clearInterval(clear1);
      clearInterval(clear2);
      clearInterval(clear3);
      clearInterval(clear4);
      clearInterval(clear5);
      clearInterval(clear6);
      clearInterval(clear7);
      clearInterval(clear8);
      clearInterval(clear9);
      clearInterval(clearInt);
      // Clear crash-checking intervals
      clearInterval(crashInterval1);
      clearInterval(crashInterval2);
      clearInterval(crashInterval3);
      clearInterval(crashInterval4);
      clearInterval(crashInterval5);
      clearInterval(crashInterval7);
      clearInterval(crashInterval9);
      obs.style.top = carY + "px";
      gameover.style.visibility = "visible";
      scoref = null;
      clearInterval(clearScore);
      scoreg.innerHTML = "YOUR SCORE - " + score;
      clearInterval(clearspeed1);
      clearInterval(clearspeed2);
      clearInterval(clearspeed3);
      clearInterval(clearspeed4);
      clearInterval(clearspeed5);
    }
  }

  // Crash-checking intervals for each obstacle
  let crashInterval1 = setInterval(() => {
    crash(car, obs1, f1, clear1);
  }, 50);

  let crashInterval2 = setInterval(() => {
    crash(car, obs2, f2, clear2);
  }, 50);

  let crashInterval3 = setInterval(() => {
    crash(car, obs3, f3, clear3);
  }, 50);

  let crashInterval4 = setInterval(() => {
    crash(car, obs4, f4, clear4);
  }, 50);

  let crashInterval5 = setInterval(() => {
    crash(car, obs5, f5, clear5);
  }, 50);

  let crashInterval7 = setInterval(() => {
    crash(car, obs7, f7, clear7);
  }, 50);

  let crashInterval9 = setInterval(() => {
    crash(car, obs9, f9, clear9);
  }, 50);
};

//logic for Main Menu btn

let mainMenubtn = document.getElementById("mainMenubtn");
mainMenubtn.addEventListener("click", function remenu() {
  // newgame=null;
  location.reload();
  gameover.style.visibility = "hidden";
  mainMenu.style.visibility = "visible";
  intro2.play();
});
// newgame();

// logic for Play Again
let playagain = document.getElementById("playagain");
playagain.addEventListener("click", function regame() {
  gameover.style.visibility = "hidden";
  mainMenu.style.visibility = "hidden";
  location.reload();
  intro2.play();
});

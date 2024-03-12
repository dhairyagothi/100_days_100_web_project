

 let value = document.querySelector('#num');
let progress = document.querySelector('.block2');
let button = document.querySelector('#btn');
let start = 0 ;
let end = 90;
let speed = 100;

  let timer = setInterval(function() {
        if (start >= end) {
            clearInterval(timer);
        }
        progress.style.background = `conic-gradient(#52c234 ${start * 3.6}deg, #061700 ${start * 3.6}deg, #52c234 ${start * 3.6}deg, white ${0}deg)`;
        value.textContent = `${start}%`;
        start++;
    }, speed);
button.addEventListener('click', setInterval(timer, speed));




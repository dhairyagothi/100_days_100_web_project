document.addEventListener("DOMContentLoaded", () => {
    let countdownInterval;
    let elapsedTime = 0; // Start from 0 seconds
  
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
  
    const startButton = document.getElementById("start");
    const pauseButton = document.getElementById("pause");
    const resetButton = document.getElementById("reset");
  
    const updateCountdown = () => {
      const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  
      daysElement.textContent = days.toString().padStart(2, "0");
      hoursElement.textContent = hours.toString().padStart(2, "0");
      minutesElement.textContent = minutes.toString().padStart(2, "0");
      secondsElement.textContent = seconds.toString().padStart(2, "0");
    };
  
    const startCountdown = () => {
      clearInterval(countdownInterval); // Prevent multiple intervals
      countdownInterval = setInterval(() => {
        elapsedTime += 1000; // Increment elapsed time by 1 second
        updateCountdown();
      }, 1000);
    };
  
    const pauseCountdown = () => {
      clearInterval(countdownInterval); // Stop the interval
    };
  
    const resetCountdown = () => {
      clearInterval(countdownInterval); // Stop the interval
      elapsedTime = 0; // Reset elapsed time to 0
      updateCountdown();
    };
  
    startButton.addEventListener("click", startCountdown);
    pauseButton.addEventListener("click", pauseCountdown);
    resetButton.addEventListener("click", resetCountdown);
  
    // Initialize the timer at 0
    updateCountdown();
  });
  
const captcha = document.querySelector(".image input");
const refreshButton = document.querySelector(".refresh");
const text = document.querySelector(".textcaptcha input");
const message = document.querySelector(".result");
const button = document.querySelector(".button");

let captchaText = null;

const generateCaptcha = () => {
  // Generate a random 5-character string with alphanumeric characters (letters and numbers)
  const randomString = Math.random().toString(36).substring(2, 7);
   // Store the generated captcha text
  captcha.value = randomString; 
  captchaText = randomString;
};

const refreshClick = () => {
  generateCaptcha();
  
 
};

const submission = () => {
  

  const input = text.value; // Ensure consistent case

  message.classList.add("active");

  if (input === captchaText) {
    message.innerText = "Entered Captcha is correct!";
    text.value=""
    message.style.color = "green" ;
  } else {
    message.innerText = "Entered Captcha is incorrect.";
    text.value=""
    message.style.color = "red" ;
  }
generateCaptcha();

};

refreshButton.addEventListener("click", refreshClick);
button.addEventListener("click", submission);

generateCaptcha();

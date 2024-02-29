const captcha = document.querySelector(".image input");
const refreshbutton = document.querySelector(".refresh");
const text = document.querySelector(".textcaptcha input");
const message = document.querySelector(".result");
const button = document.querySelector(".button");

let captchatext = null ;

const generateCaptcha = () => {
    const randomString = Math.random().toString(36).substring(2,7);
    captcha.value=randomString;
}
const refreshclick =()=>{
    generateCaptcha();
}
const submission =()=>{
    refreshclick();
    const input = toString(captcha.value)
    message.classList.add("active")
    if(text.value===input){
        message.innerText="Entered Captcha is correct";
      
    }
    else{
        message.innerText="Entered Captcha is incorrect";
        
    }
   
}

refreshbutton.addEventListener("click",refreshclick);
button.addEventListener("click",submission);
generateCaptcha();
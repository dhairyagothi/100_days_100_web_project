const line=[ "The Fearsome Lion: A mighty lion ruled the forest, terrifying all animals. Every day, he hunted mercilessly, making the creatures live in fear.",
    "The Scared Animals: The animals were terrified of the lion and desperately searched for a way to stop his constant hunting.",
    "The Lion’s Daily Kill: With no one to challenge him, the lion continued to hunt and kill animals every day, causing panic in the jungle.",
    "Choosing the Rabbit: To prevent random killings, the animals decided that one of them would be sent as a sacrifice each day. When it was the rabbit’s turn, he was chosen reluctantly because of his small size.",
    "The Rabbit’s Plan: Instead of going directly to the lion, the clever rabbit thought of a way to trick him. He delayed his arrival and came up with a story to deceive the lion.",
    "The Deception: The rabbit told the lion that another, stronger lion had claimed the jungle and had stopped him on the way. Enraged, the lion demanded to see his so-called rival.",
    "The Well Trick: The rabbit led the lion to a deep well and pointed inside, saying the rival lion was inside. The lion looked in and saw his own reflection in the water.",
    "The Fatal Leap: The lion, thinking his reflection was a real enemy, roared angrily. He jumped into the well to attack, only to drown in the deep water.",
    "The Animals’ Celebration: The rabbit returned to the other animals and announced the lion’s demise. Overjoyed, the animals cheered and finally lived in peace, free from fear.<br>THE END"
    
];
const images=["images/lion.webp","images/second.webp","images/lion+kill.jpg","images/rabbit.png","images/rabbit+thinking.avif","images/well.jpg","images/poster.jpeg","images/lion+look.jpeg","images/animal+happy.avif"]
let i=0;
let speech=null;
let isPaused = false;
let pausedText="";
document.getElementById("text").innerHTML=line[i];


function speak(text){
    if(speechSynthesis.speaking && isPaused){
        speechSynthesis.resume();
        isPaused=false;
        return;
    }
    if(speech){
        speechSynthesis.cancel();
    }
    speech=new SpeechSynthesisUtterance(text);
    speech.lang="en-US";
    speech.volume=1;
    speech.rate=1;
    speech.pitch=1;

    let voices=speechSynthesis.getVoices();
    speech.voice=voices.find(voice =>voice.name==="Google US English");

    speech.onboundary=(event)=>{
        pausedText=text.substring(event.charIndex);
    }
    isPaused=false;
    speechSynthesis.speak(speech);
}

document.getElementById("next").addEventListener("click", function(){
    i=(i+1)%line.length;
    document.getElementById("text").innerHTML=line[i];
    document.getElementById("image").src=images[i];
});


document.getElementById("pause").addEventListener("click", function(){
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        isPaused = true;
    }
});


document.getElementById("play").addEventListener("click", function(){
    let text1=document.getElementById("text").innerHTML;
    if(isPaused){
        speechSynthesis.resume();
        isPaused=false;
    }
    else{
        speak(text1);
    }
});

document.getElementById("stop").addEventListener("click", function(){
    speechSynthesis.cancel();
    isPaused=false;
    pausedText="";
});

window.speechSynthesis.onvoiceschanged=function(){
    let voices=speechSynthesis.getVoices();
    console.log(voices);
};
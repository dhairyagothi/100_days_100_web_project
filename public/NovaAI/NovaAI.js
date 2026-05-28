// REVEAL

const reveals = document.querySelectorAll(".reveal");

function revealSections(){

  reveals.forEach((element)=>{

    const windowHeight = window.innerHeight;
    const revealTop =
    element.getBoundingClientRect().top;

    if(revealTop < windowHeight - 100){
      element.classList.add("active");
    }

  });

}

window.addEventListener("scroll",revealSections);

revealSections();


// COUNTERS

const counters = document.querySelectorAll(".counter");

const speed = 100;

counters.forEach(counter=>{

  const updateCounter = ()=>{

    const target =
    +counter.getAttribute("data-target");

    const count =
    +counter.innerText;

    const increment = target / speed;

    if(count < target){

      counter.innerText =
      Math.ceil(count + increment);

      setTimeout(updateCounter,20);

    }else{
      counter.innerText = target;
    }

  };

  updateCounter();

});


// NAVBAR

const navbar =
document.getElementById("navbar");

window.addEventListener("scroll",()=>{

  navbar.classList.toggle(
    "scrolled",
    window.scrollY > 50
  );

});


// CUSTOM CURSOR

const cursor =
document.querySelector(".cursor");

const ring =
document.createElement("div");

ring.classList.add("cursor-ring");

document.body.appendChild(ring);

document.addEventListener("mousemove",(e)=>{

  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  ring.style.left = e.clientX + "px";
  ring.style.top = e.clientY + "px";

});


// HOVER EFFECT

const hoverItems =
document.querySelectorAll(
  "a, button, .card, .team-card, .stat-box"
);

hoverItems.forEach(item=>{

  item.addEventListener("mouseenter",()=>{

    cursor.classList.add("hover");

  });

  item.addEventListener("mouseleave",()=>{

    cursor.classList.remove("hover");

  });

});


// BUTTON FUNCTIONS

const investBtns =
document.querySelectorAll(".primary-btn");

investBtns.forEach(btn=>{

  btn.addEventListener("click",()=>{

    btn.innerText = "Invested ✔";

    btn.style.background =
    "linear-gradient(to right,#22c55e,#16a34a)";

  });

});


// WATCH PITCH BUTTON

const watchBtn =
document.querySelector(".secondary-btn");

watchBtn.addEventListener("click",()=>{

  window.scrollTo({
    top:document.body.scrollHeight,
    behavior:"smooth"
  });

});
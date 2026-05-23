document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && e.target !== menuToggle) {
                navLinks.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();  
            if (navLinks) {
                navLinks.classList.remove('active');
            }
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const buttons=document.querySelectorAll("button.btn");

    buttons.forEach(button => {
        button.addEventListener("mouseenter", () => {
            button.style.transform = "scale(1.05)";
            button.style.transition = "0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        });
        button.addEventListener("mouseleave", () => {
            button.style.transform = "scale(1)";
        });
    });
});

window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.8s ease";
    requestAnimationFrame(() => {
        document.body.style.opacity = "1";
    });
});

window.addEventListener("resize",()=>{

    if(window.innerWidth>860){
        navLinks.classList.remove("active");
    }

}); 


```js id="tybgnj"
// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function () {

    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

    });

});


/* THEME TOGGLE */

const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        toggleBtn.innerHTML = "☀️";
    } else {
        toggleBtn.innerHTML = "🌙";
    }

});


/* FAQ ACCORDION */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        faqItems.forEach(faq => {

            if (faq !== item) {
                faq.classList.remove("active");
            }

        });

        item.classList.toggle("active");

    });

});
```

// ======================================
// STUDYSYNC COMPLETE SCRIPT
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // MOBILE MENU
    // ======================================

    const menu = document.querySelector(".menu");
    const navLinks = document.querySelector("nav ul");

    if (menu) {
        menu.addEventListener("click", () => {
            navLinks.classList.toggle("show-menu");
        });
    }

    // ======================================
    // SMOOTH SCROLLING
    // ======================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (e) {

            const targetId =
                this.getAttribute("href");

            if (targetId !== "#") {

                e.preventDefault();

                const target =
                    document.querySelector(targetId);

                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }
        });

    });

    // ======================================
    // TYPEWRITER EFFECT
    // ======================================

    const heading =
        document.getElementById("p2");

    if (heading) {

        const text =
            heading.textContent;

        heading.textContent = "";

        let index = 0;

        function typeWriter() {

            if (index < text.length) {

                heading.textContent +=
                    text.charAt(index);

                index++;

                setTimeout(typeWriter, 50);
            }
        }

        typeWriter();
    }

    // ======================================
    // SCROLL REVEAL
    // ======================================

    const observer =
        new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }

            });

        }, {
            threshold: 0.2
        });

    document
        .querySelectorAll(
            ".card,.review,.newsletter,.content"
        )
        .forEach(el => observer.observe(el));

    // ======================================
    // ANIMATED COUNTERS
    // ======================================

    const counters =
        document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const target =
            +counter.dataset.target;

        const updateCount = () => {

            const current =
                +counter.innerText;

            const increment =
                target / 100;

            if (current < target) {

                counter.innerText =
                    Math.ceil(
                        current + increment
                    );

                setTimeout(updateCount, 20);

            } else {

                counter.innerText = target;

            }
        };

        updateCount();

    });

    // ======================================
    // TESTIMONIAL AUTO HIGHLIGHT
    // ======================================

    const reviews =
        document.querySelectorAll(".review");

    if (reviews.length > 0) {

        let current = 0;

        setInterval(() => {

            reviews.forEach(review => {
                review.classList.remove("active");
            });

            reviews[current]
                .classList.add("active");

            current++;

            if (current >= reviews.length) {
                current = 0;
            }

        }, 3000);
    }

    // ======================================
    // NEWSLETTER
    // ======================================

    const form =
        document.querySelector("form");

    if (form) {

        form.addEventListener(
            "submit",
            e => {

                e.preventDefault();

                const email =
                    document
                    .getElementById("name")
                    .value
                    .trim();

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailPattern.test(email)) {

                    alert(
                        "Please enter valid email"
                    );

                    return;
                }

                let subscribers =
                    JSON.parse(
                        localStorage.getItem(
                            "subscribers"
                        )
                    ) || [];

                subscribers.push(email);

                localStorage.setItem(
                    "subscribers",
                    JSON.stringify(
                        subscribers
                    )
                );

                alert(
                    "Subscribed Successfully!"
                );

                form.reset();
            }
        );
    }

    // ======================================
    // SEARCH FEATURES
    // ======================================

    const search =
        document.getElementById("search");

    if (search) {

        search.addEventListener(
            "keyup",
            e => {

                const value =
                    e.target.value
                    .toLowerCase();

                document
                    .querySelectorAll(".card")
                    .forEach(card => {

                        const title =
                            card
                            .querySelector("h4")
                            .innerText
                            .toLowerCase();

                        card.style.display =
                            title.includes(value)
                                ? "block"
                                : "none";

                    });

            }
        );
    }

    // ======================================
    // DARK MODE
    // ======================================

    const darkBtn =
        document.getElementById("darkBtn");
    
    if (
        localStorage.getItem("theme")
        === "dark"
    ) {
        document.body.classList.add("dark");
    }

    darkBtn.addEventListener(
        "click",
        () => {

            document.body.classList
                .toggle("dark");

            localStorage.setItem(
                "theme",
                document.body.classList
                    .contains("dark")
                    ? "dark"
                    : "light"
            );

        }
    );

    // ======================================
    // BACK TO TOP BUTTON
    // ======================================

    const topBtn =
        document.createElement("button");

    topBtn.innerHTML = "⬆";

    topBtn.id = "topBtn";

    document.body.appendChild(topBtn);

    topBtn.style.position = "fixed";
    topBtn.style.left = "20px";
    topBtn.style.bottom = "20px";
    topBtn.style.display = "none";
    topBtn.style.zIndex = "999";

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 300) {

                topBtn.style.display =
                    "block";

            } else {

                topBtn.style.display =
                    "none";

            }
        }
    );

    topBtn.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

    // ======================================
    // SCROLL PROGRESS BAR
    // ======================================

    const progress =
        document.createElement("div");

    progress.id = "progressBar";

    progress.style.position = "fixed";
    progress.style.top = "0";
    progress.style.left = "0";
    progress.style.height = "5px";
    progress.style.width = "0%";
    progress.style.zIndex = "9999";
    progress.style.background =
        "#2563eb";

    document.body.appendChild(progress);

    window.addEventListener(
        "scroll",
        () => {

            const totalHeight =
                document.documentElement
                    .scrollHeight -
                document.documentElement
                    .clientHeight;

            const current =
                (
                    window.scrollY /
                    totalHeight
                ) * 100;

            progress.style.width =
                current + "%";

        }
    );

});

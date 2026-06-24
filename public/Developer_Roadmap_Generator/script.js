const roadmapData = {
    frontend: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Responsive Design",
        "Git & GitHub",
        "React.js",
        "Next.js",
        "TypeScript",
        "API Integration",
        "Deployment"
    ],

    backend: [
        "JavaScript",
        "Node.js",
        "Express.js",
        "REST APIs",
        "MongoDB",
        "Authentication",
        "JWT",
        "Database Design",
        "Cloud Deployment",
        "Docker"
    ],

    fullstack: [
        "HTML & CSS",
        "JavaScript",
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Authentication",
        "REST APIs",
        "Deployment",
        "System Design"
    ],

    ai: [
        "Python",
        "NumPy",
        "Pandas",
        "Matplotlib",
        "Machine Learning",
        "Scikit-learn",
        "Deep Learning",
        "TensorFlow",
        "Neural Networks",
        "Generative AI"
    ],

    cybersecurity: [
        "Networking",
        "Linux",
        "Python",
        "Web Security",
        "Cryptography",
        "Ethical Hacking",
        "OWASP",
        "Penetration Testing",
        "Cloud Security",
        "Bug Bounty"
    ]
};

const container = document.getElementById("roadmap-container");
const title = document.getElementById("title");

function generateRoadmap(role) {

    title.innerText =
        role.charAt(0).toUpperCase() +
        role.slice(1) +
        " Roadmap";

    container.innerHTML = "";

    roadmapData[role].forEach((step, index) => {

        const card = document.createElement("div");

        card.classList.add("step-card");

        card.innerHTML =
        `
        <h3>Step ${index + 1}</h3>
        <p>${step}</p>
        `;

        container.appendChild(card);
    });

    document
        .querySelector(".roadmap-section")
        .scrollIntoView({
            behavior: "smooth"
        });
}

document
    .querySelectorAll(".career-card")
    .forEach(card => {

        card.addEventListener("click", () => {

            generateRoadmap(
                card.dataset.role
            );

        });

    });
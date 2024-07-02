// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// Simulated blog posts
const blogPosts = [
    { title: 'Getting Started with JavaScript', content: `JavaScript is a versatile programming language that powers the interactive elements of websites. It's essential for any aspiring web developer to master. In this post, we'll cover the basics of JavaScript syntax, variables, and functions.`, author: 'John Doe', date: '2024-06-01', image: './assets/javascript.jpg', link: 'lin' },
    { title: 'CSS Grid Layout', content: 'CSS Grid is a powerful tool for creating complex layouts in web design. It allows for more flexibility and control over the positioning of elements on a page. This post will introduce you to the basics of CSS Grid and how to use it effectively.', author: 'Jane Smith', date: '2024-06-05', image: './assets/cssGrid.jpg', link: 'https://example.com/css-post' },
    { title: 'Responsive Web Design', content: `Designing for multiple screen sizes is crucial in today's multi-device world. Responsive web design ensures that your website looks great on everything from smartphones to desktop computers. Learn the principles and techniques in this comprehensive guide.`, author: 'Mike Johnson', date: '2024-06-10', image: './assets/responsiveWeb.jpg', link: 'https://example.com/rwd-post' },
    { title: 'Introduction to React Hooks', content: 'React Hooks provide a more direct API to the React concepts you already know. They allow you to use state and other React features without writing a class. This post will introduce you to the most commonly used hooks and how to implement them in your projects.', author: 'Emily Brown', date: '2024-06-15', image: './assets/react.jpg', link: 'https://example.com/react-post' },
    { title: 'Python for Data Science', content: `Python has become the go-to language for data scientists due to its simplicity and powerful libraries. In this post, we'll explore how to use Python for data analysis, visualization, and machine learning tasks. Get ready to dive into the world of data science!`, author: 'David Wilson', date: '2024-06-20', image: './assets/4401280.jpg', link: 'https://example.com/python-post' },
];

const blogPostsContainer = document.getElementById('blogPosts');
blogPosts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
        <div class="post-image-container">
            <img src="${post.image}" alt="${post.title}" class="post-image">
        </div>
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
            <div class="post-info">
                <span>By ${post.author} on ${post.date}</span>
                <a href="${post.link}" class="read-more" target="_blank">Read More</a>
            </div>
        </div>
    `;
    blogPostsContainer.appendChild(postElement);
});

// Authors list
const authors = [
    { name: 'John Doe', image: './assets/male1.jpg' },
    { name: 'Max Sharter', image: './assets/female1.jpg' },
    { name: 'Mike Johnson', image: './assets/male2.jpg' },
    { name: 'Emily Brown', image: './assets/female2.jpg' },
    { name: 'David Wilson', image: './assets/male3.jpg' }
];

const authorsContainer = document.getElementById('authors');
authors.forEach(author => {
    const authorElement = document.createElement('div');
    authorElement.classList.add('author-item');
    authorElement.innerHTML = `
        <img src="${author.image}" alt="${author.name}" class="author-image">
        <span>${author.name}</span>
    `;
    authorsContainer.appendChild(authorElement);
});

// More Posts button functionality
const morePostsBtn = document.getElementById('morePosts');
morePostsBtn.addEventListener('click', () => {
    // Implement logic to load more posts
    alert('More posts would be loaded here.');
});

// Categories
const categories = ['JavaScript', 'CSS', 'HTML', 'React', 'Python', 'Data Science', 'Web Design'];
const categoriesContainer = document.getElementById('categories');
categories.forEach(category => {
    const categoryElement = document.createElement('p');
    categoryElement.textContent = category;
    categoriesContainer.appendChild(categoryElement);
});

// Auth modal functionality
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const closeBtn = document.getElementsByClassName('close')[0];
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

authBtn.onclick = function() {
    authModal.style.display = 'block';
}

closeBtn.onclick = function() {
    authModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == authModal) {
        authModal.style.display = 'none';
    }
}

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`${tabName}Form`).classList.add('active');
    });
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Implement login logic here
    alert('Login functionality would be implemented here.');
    authModal.style.display = 'none';
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Implement signup logic here
    alert('Signup functionality would be implemented here.');
    authModal.style.display = 'none';
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animation for post elements when they come into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.post').forEach(post => {
    post.style.opacity = 0;
    post.style.transform = 'translateY(20px)';
    post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(post);
});

// Responsive navigation
const navToggle = document.createElement('button');
navToggle.textContent = '☰';
navToggle.style.fontSize = '1.5rem';
navToggle.style.background = 'none';
navToggle.style.border = 'none';
navToggle.style.color = 'var(--text-color)';
navToggle.style.cursor = 'pointer';
navToggle.style.display = 'none';

const navUl = document.querySelector('nav ul');
const nav = document.querySelector('nav');
nav.insertBefore(navToggle, navUl);

navToggle.addEventListener('click', () => {
    navUl.classList.toggle('show');
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navUl.classList.remove('show');
        navToggle.style.display = 'none';
    } else {
        navToggle.style.display = 'block';
    }
});

// Initial check for mobile view
if (window.innerWidth <= 768) {
    navToggle.style.display = 'block';
}

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Implement contact form submission logic here
    alert('Thank you for your message. We will get back to you soon!');
    e.target.reset();
});

// Subscribe form submission
document.getElementById('subscribeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Implement subscribe form submission logic here
    alert('Thank you for subscribing to our blog!');
    e.target.reset();
});

backToTopButton.addEventListener("click", function(){
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});
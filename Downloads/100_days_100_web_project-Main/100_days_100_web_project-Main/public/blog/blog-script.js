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
    { title: 'Getting Started with JavaScript', content: `JavaScript is a versatile programming language that powers the interactive elements of websites. It's essential for any aspiring web developer to master. In this post, we'll cover the basics of JavaScript syntax, variables, and functions.`, author: 'John Doe', date: '2024-06-01', image: './assets/javascript.jpg', tags: ['JavaScript', 'Web Development'] },
    { title: 'CSS Grid Layout', content: 'CSS Grid is a powerful tool for creating complex layouts in web design. It allows for more flexibility and control over the positioning of elements on a page. This post will introduce you to the basics of CSS Grid and how to use it effectively.', author: 'Jane Smith', date: '2024-06-05', image: './assets/cssGrid.jpg', tags: ['CSS', 'Web Design'] },
    { title: 'Responsive Web Design', content: `Designing for multiple screen sizes is crucial in today's multi-device world. Responsive web design ensures that your website looks great on everything from smartphones to desktop computers. Learn the principles and techniques in this comprehensive guide.`, author: 'Mike Johnson', date: '2024-06-10', image: './assets/responsiveWeb.jpg', tags: ['CSS', 'Web Design', 'Responsive'] },
    { title: 'Introduction to React Hooks', content: 'React Hooks provide a more direct API to the React concepts you already know. They allow you to use state and other React features without writing a class. This post will introduce you to the most commonly used hooks and how to implement them in your projects.', author: 'Emily Brown', date: '2024-06-15', image: './assets/react.jpg', tags: ['JavaScript', 'React', 'Web Development'] },
    { title: 'Python for Data Science', content: `Python has become the go-to language for data scientists due to its simplicity and powerful libraries. In this post, we'll explore how to use Python for data analysis, visualization, and machine learning tasks. Get ready to dive into the world of data science!`, author: 'David Wilson', date: '2024-06-20', image: './assets/4401280.jpg', tags: ['Python', 'Data Science'] },
];

// Function to display blog posts
function displayBlogPosts(posts) {
    const blogPostsContainer = document.getElementById('blogPosts');
    blogPostsContainer.innerHTML = '';
    posts.forEach(post => {
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
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="#" class="read-more">Read More</a>
                </div>
            </div>
        `;
        blogPostsContainer.appendChild(postElement);
    });
}

// Initial display of blog posts
displayBlogPosts(blogPosts);

// Search functionality
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPosts = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        post.date.includes(searchTerm)
    );
    displayBlogPosts(filteredPosts);
});

// Categories
const categories = ['JavaScript', 'CSS', 'HTML', 'React', 'Python', 'Data Science', 'Web Design'];
const categoriesContainer = document.getElementById('categories');
categories.forEach(category => {
    const categoryElement = document.createElement('span');
    categoryElement.classList.add('tag');
    categoryElement.textContent = category;
    categoryElement.addEventListener('click', () => {
        const filteredPosts = blogPosts.filter(post => post.tags.includes(category));
        displayBlogPosts(filteredPosts);
    });
    categoriesContainer.appendChild(categoryElement);
});

// Recent posts
const recentPostsContainer = document.getElementById('recentPosts');
blogPosts.slice(0, 3).forEach(post => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#">${post.title}</a>`;
    recentPostsContainer.appendChild(li);
});

// Popular posts (simulated)
const popularPostsContainer = document.getElementById('popularPosts');
blogPosts.slice(2, 5).forEach(post => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#">${post.title}</a>`;
    popularPostsContainer.appendChild(li);
});

// Subscribe form submission
document.getElementById('subscribe-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our blog!');
    e.target.reset();
});

// Pagination (simulated)
const itemsPerPage = 3;
let currentPage = 1;
const totalPages = Math.ceil(blogPosts.length / itemsPerPage);

function updatePagination() {
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        displayBlogPosts(blogPosts.slice(startIndex, endIndex));
        updatePagination();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        displayBlogPosts(blogPosts.slice(startIndex, endIndex));
        updatePagination();
    }
});

// Initial pagination setup
updatePagination();

// Featured posts slider
function createFeaturedPostsSlider() {
    const sliderContainer = document.querySelector('.featured-posts-slider');
    const featuredPosts = blogPosts.slice(0, 3); // Use the first 3 posts as featured

    featuredPosts.forEach(post => {
        const slide = document.createElement('div');
        slide.classList.add('slider-slide');
        slide.innerHTML = `
            <img src="${post.image}" alt="${post.title}">
            <div class="slide-content">
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <a href="#" class="read-more">Read More</a>
            </div>
        `;
        sliderContainer.appendChild(slide);
    });

    // Simple slider functionality
    let currentSlide = 0;
    const slides = sliderContainer.querySelectorAll('.slider-slide');
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);

    // Show the first slide initially
    showSlide(currentSlide);
}

createFeaturedPostsSlider();

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

function checkScreenSize() {
    if (window.innerWidth <= 768) {
        navToggle.style.display = 'block';
        navUl.classList.remove('show');
    } else {
        navToggle.style.display = 'none';
        navUl.classList.remove('show');
    }
}

window.addEventListener('resize', checkScreenSize);
checkScreenSize(); // Initial check

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

function animatePosts() {
    document.querySelectorAll('.post').forEach(post => {
        post.style.opacity = 0;
        post.style.transform = 'translateY(20px)';
        post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(post);
    });
}

// Call animatePosts after displaying blog posts
const originalDisplayBlogPosts = displayBlogPosts;
function displayBlogPosts(posts) {
    const blogPostsContainer = document.getElementById('blogPosts');
    blogPostsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        const readingTime = Math.ceil(post.content.split(' ').length / 200); // Assuming 200 words per minute
        postElement.innerHTML = `
            <div class="post-image-container">
                <img src="${post.image}" alt="${post.title}" class="post-image">
            </div>
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
                <div class="post-info">
                    <span>By ${post.author} on ${post.date}</span>
                    <span class="reading-time">${readingTime} min read</span>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="#" class="read-more">Read More</a>
                </div>
            </div>
        `;
        blogPostsContainer.appendChild(postElement);
    });
}
// Initial animation call
animatePosts();

// Auth modal functionality (same as home page)
// ... (Include the auth modal code here)

// Add any additional functionality specific to the blog page here
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authTabs = document.querySelectorAll('.auth-tab');

authBtn.addEventListener('click', () => {
    authModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    authModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.dataset.tab === 'login') {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    });
});
const backToTopButton = document.getElementById("backToTop");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
}

backToTopButton.addEventListener("click", function(){
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});

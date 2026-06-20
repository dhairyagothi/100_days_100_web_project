console.log("auth js loaded");
if (typeof blogs !== 'undefined') {
    console.log("Blogs:", blogs);
}

if (!document.getElementById("createBlogModal") && (window.location.pathname.includes("ai.html") || window.location.pathname.includes("of.html"))) {
    const createBlogModalDiv = document.createElement("div");
    createBlogModalDiv.id = "createBlogModal";
    createBlogModalDiv.className = "auth-modal";
    createBlogModalDiv.innerHTML = `
        <div class="auth-box">
            <span class="close-modal">&times;</span>
            <h2>Edit Blog</h2>
            <form id="blogForm">
                <input type="text" id="blogTitle" placeholder="Blog Title" required>
                <input type="text" id="blogCategory" placeholder="Category" required>
                <input type="file" id="blogImage" accept="image/png,image/jpeg,image/webp">
                <textarea id="blogContent" rows="8" placeholder="Write your blog..." required></textarea>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    `;
    document.body.appendChild(createBlogModalDiv);
}

const sanitizeInput = (str) => {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

const updateTheme = () => {
    if (darkMode) {
        document.body.classList.add("dark-mode");
        if (themeIcon) themeIcon.innerHTML = "🌙";
    } else {
        document.body.classList.remove("dark-mode");
        if (themeIcon) themeIcon.innerHTML = "☀️";
    }
};

updateTheme();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        darkMode = !darkMode;
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
        updateTheme();
    });
}

let commentsElement = null;
let commentTextarea = null;
let usernameInput = null;

let liked = JSON.parse(localStorage.getItem("liked")) || false;
let bookmarked = JSON.parse(localStorage.getItem("bookmarked")) || false;
let comments = JSON.parse(localStorage.getItem("comments")) || [];

const showToast = (message, type = "success") => {
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toastContainer";
        toastContainer.style.position = "fixed";
        toastContainer.style.bottom = "20px";
        toastContainer.style.right = "20px";
        toastContainer.style.zIndex = "10000";
        toastContainer.style.display = "flex";
        toastContainer.style.flexDirection = "column";
        toastContainer.style.gap = "10px";
        document.body.appendChild(toastContainer);
    }

    const icons = {
        success: "✅",
        info: "ℹ️",
        error: "❌",
    };

    const toast = document.createElement("div");
    toast.className = "flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white bg-gray-800 dark:bg-gray-700 transition-all duration-300";
    toast.style.transform = "translateY(20px)";
    toast.style.opacity = "0";

    toast.innerHTML = `
        <span>${icons[type] || icons.success}</span>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = "translateY(0)";
        toast.style.opacity = "1";
    }, 10);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";
        setTimeout(() => toast.remove(), 300);
    }, 2800);
};

const progressBar = document.getElementById("progressBar");

window.addEventListener("scroll", () => {
    if (progressBar) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }
});

const likeOutline = document.getElementById("like");
const likeFill = document.getElementById("liked");

const updateLikeUI = () => {
    if (!likeOutline || !likeFill) return;
    if (liked) {
        likeOutline.classList.add("hidden");
        likeFill.classList.remove("hidden");
    } else {
        likeOutline.classList.remove("hidden");
        likeFill.classList.add("hidden");
    }
};

if (likeOutline && likeFill) {
    updateLikeUI();

    likeOutline.addEventListener("click", () => {
        liked = true;
        localStorage.setItem("liked", JSON.stringify(liked));
        updateLikeUI();
        showToast("You liked this post!");
    });

    likeFill.addEventListener("click", () => {
        liked = false;
        localStorage.setItem("liked", JSON.stringify(liked));
        updateLikeUI();
        showToast("Like removed.", "info");
    });
}

const bookmarkOutline = document.getElementById("bookmark");
const bookmarkFill = document.getElementById("bookmarked");

const updateBookmarkUI = () => {
    if (!bookmarkOutline || !bookmarkFill) return;
    if (bookmarked) {
        bookmarkOutline.classList.add("hidden");
        bookmarkFill.classList.remove("hidden");
    } else {
        bookmarkOutline.classList.remove("hidden");
        bookmarkFill.classList.add("hidden");
    }
};

if (bookmarkOutline && bookmarkFill) {
    updateBookmarkUI();

    bookmarkOutline.addEventListener("click", () => {
        bookmarked = true;
        localStorage.setItem("bookmarked", JSON.stringify(bookmarked));
        updateBookmarkUI();
        showToast("Post bookmarked!");
    });

    bookmarkFill.addEventListener("click", () => {
        bookmarked = false;
        localStorage.setItem("bookmarked", JSON.stringify(bookmarked));
        updateBookmarkUI();
        showToast("Bookmark removed.", "info");
    });
}

const shareButton = document.getElementById("share");

if (shareButton) {
    shareButton.addEventListener("click", async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Blog",
                    text: "Check out this blog page!",
                    url: window.location.href,
                });
                showToast("Thanks for sharing!");
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard!", "info");
            }
        } catch (error) {
            console.log(error);
        }
    });
}

const renderComments = () => {
    if (!commentsElement) return;
    commentsElement.innerHTML = "";

    if (comments.length === 0) {
        commentsElement.innerHTML = `<p id="emptyMessage">No comments yet</p>`;
        return;
    }

    comments.forEach((commentObj, index) => {
        const safeAuthor = sanitizeInput(commentObj.author || "Anonymous");
        const safeText = sanitizeInput(commentObj.text);

        const commentElement = document.createElement("div");
        commentElement.className = "bg-gray-100 dark:bg-gray-700 rounded-xl p-4 shadow-sm transition duration-300";

        commentElement.innerHTML = `
            <div class="flex justify-between items-start gap-2">
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                        ${safeAuthor}
                    </p>
                    <p class="text-gray-700 dark:text-gray-200 break-words" id="comment-text-${index}">
                        ${safeText}
                    </p>
                    <textarea
                        id="edit-input-${index}"
                        class="hidden w-full mt-2 p-2 text-sm border border-emerald-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white dark:bg-gray-600 text-black dark:text-white resize-none"
                        rows="2"
                    >${commentObj.text}</textarea>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        ${commentObj.date ? commentObj.date + " · " : ""}${commentObj.time}
                    </p>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                    <button class="like-comment text-pink-500 hover:scale-110 transition" data-index="${index}">
                        ❤️ <span class="like-count">${commentObj.likes}</span>
                    </button>
                    <button class="edit-btn text-blue-400 hover:text-blue-600 transition text-sm" data-index="${index}" title="Edit comment">
                        ✏️
                    </button>
                    <button class="delete-btn text-red-500 hover:text-red-700 transition" data-index="${index}" title="Delete comment">
                        🗑
                    </button>
                </div>
            </div>
            <div id="edit-actions-${index}" class="hidden mt-2">
                <button class="save-edit-btn text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg transition" data-index="${index}">
                    Save
                </button>
                <button class="cancel-edit-btn text-xs bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-1 rounded-lg transition" data-index="${index}">
                    Cancel
                </button>
            </div>
        `;

        commentsElement.appendChild(commentElement);
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            comments.splice(index, 1);
            localStorage.setItem("comments", JSON.stringify(comments));
            renderComments();
            showToast("Comment deleted.", "info");
        });
    });

    document.querySelectorAll(".like-comment").forEach((button) => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            comments[index].likes++;
            localStorage.setItem("comments", JSON.stringify(comments));
            renderComments();
        });
    });

    document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            document.getElementById(`comment-text-${index}`).classList.add("hidden");
            document.getElementById(`edit-input-${index}`).classList.remove("hidden");
            const actions = document.getElementById(`edit-actions-${index}`);
            actions.classList.remove("hidden");
            actions.classList.add("flex", "gap-2");
            const editInput = document.getElementById(`edit-input-${index}`);
            editInput.focus();
            editInput.setSelectionRange(editInput.value.length, editInput.value.length);
        });
    });

    document.querySelectorAll(".save-edit-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            const newText = document.getElementById(`edit-input-${index}`).value.trim();
            if (newText === "") {
                showToast("Comment cannot be empty.", "error");
                return;
            }
            comments[index].text = newText;
            localStorage.setItem("comments", JSON.stringify(comments));
            renderComments();
            showToast("Comment updated!");
        });
    });

    document.querySelectorAll(".cancel-edit-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const index = button.dataset.index;
            document.getElementById(`edit-input-${index}`).value = comments[index].text;
            document.getElementById(`comment-text-${index}`).classList.remove("hidden");
            document.getElementById(`edit-input-${index}`).classList.add("hidden");
            const actions = document.getElementById(`edit-actions-${index}`);
            actions.classList.add("hidden");
            actions.classList.remove("flex", "gap-2");
        });
    });
};

const addComment = () => {
    if (!commentTextarea) return;
    const comment = commentTextarea.value.trim();
    if (comment === "") {
        showToast("Please write a comment first.", "error");
        return;
    }

    const author = usernameInput ? usernameInput.value.trim() || "Anonymous" : "Anonymous";
    if (usernameInput && usernameInput.value.trim()) {
        localStorage.setItem("username", usernameInput.value.trim());
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const currentDate = now.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });

    const commentData = {
        text: comment,
        author: author,
        time: currentTime,
        date: currentDate,
        likes: 0,
    };

    comments.push(commentData);
    localStorage.setItem("comments", JSON.stringify(comments));
    commentTextarea.value = "";
    renderComments();
    showToast("Comment added!");
};

function createBlogCard(blog) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let actions = "";

    if (currentUser && currentUser.username === blog.author) {
        actions = `
            <div class="blog-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                <button
                    class="edit-blog-btn"
                    onclick="editBlog(${blog.id})"
                    style="border: none; background: #3b82f6; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;"
                >
                    ✏️ Edit
                </button>
                <button
                    class="delete-blog-btn"
                    onclick="deleteBlog(${blog.id})"
                    style="border: none; background: #ef4444; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;"
                >
                    🗑️ Delete
                </button>
            </div>
        `;
    }

    const imgUrl = blog.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";

    return `
        <div class="blog-card flex flex-col h-full">
            <img src="${imgUrl}" alt="${sanitizeInput(blog.title)}">
            <div class="blog-card-content flex flex-col flex-grow">
                <span class="category self-start">${sanitizeInput(blog.category)}</span>
                <h3>${sanitizeInput(blog.title)}</h3>
                <p class="blog-author" style="font-size: 14px; color: #64748b; margin-bottom: 8px;">
                    By ${sanitizeInput(blog.author || "Admin")}
                </p>
                <p style="margin-bottom: 15px; flex-grow: 1;">
                    ${sanitizeInput(blog.content.slice(0, 100))}...
                </p>
                <a href="of.html?id=${blog.id}" class="read-more-btn mt-auto text-center" style="text-decoration: none; display: inline-block;">
                    Read More →
                </a>
                ${actions}
            </div>
        </div>
    `;
}

function renderHomepageBlogs() {
    const featuredContainer = document.getElementById("featuredBlog");
    const blogGrid = document.getElementById("blogGrid");

    if (!featuredContainer || !blogGrid) return;

    const localBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const staticBlogs = typeof blogs !== "undefined" ? blogs : [];
    const allBlogs = [...localBlogs, ...staticBlogs].sort((a, b) => b.id - a.id);

    if (allBlogs.length === 0) {
        featuredContainer.innerHTML = "<p>No blogs published yet.</p>";
        blogGrid.innerHTML = "";
        return;
    }

    const featured = allBlogs[0];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let featuredActions = "";
    if (currentUser && currentUser.username === featured.author) {
        featuredActions = `
            <div class="blog-actions" style="margin-top: 15px; display: flex; gap: 8px;">
                <button class="edit-blog-btn" onclick="editBlog(${featured.id})" style="border: none; background: #3b82f6; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">
                    ✏️ Edit
                </button>
                <button class="delete-blog-btn" onclick="deleteBlog(${featured.id})" style="border: none; background: #ef4444; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">
                    🗑️ Delete
                </button>
            </div>
        `;
    }

    const imgUrl = featured.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";

    featuredContainer.innerHTML = `
        <div class="featured-card">
            <div class="featured-image">
                <img src="${imgUrl}" alt="${sanitizeInput(featured.title)}">
            </div>

            <div class="featured-content">
                <span class="featured-badge">Featured Article</span>

                <h1>${sanitizeInput(featured.title)}</h1>

                <p>${sanitizeInput(featured.content.slice(0, 250))}...</p>

                <a href="of.html?id=${featured.id}" class="read-btn" style="text-decoration: none; display: inline-block;">
                    Read Full Article →
                </a>
                
                ${featuredActions}
            </div>
        </div>
    `;

    const latestBlogs = allBlogs.slice(1, 4);
    blogGrid.innerHTML = latestBlogs.map(createBlogCard).join("");
}

function renderBlogs() {
    const allBlogsGrid = document.getElementById("allBlogsGrid");
    if (!allBlogsGrid) return;

    const localBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const staticBlogs = typeof blogs !== "undefined" ? blogs : [];
    const allBlogs = [...localBlogs, ...staticBlogs].sort((a, b) => b.id - a.id);

    allBlogsGrid.innerHTML = allBlogs.map(createBlogCard).join("");
}

function deleteBlog(id) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        showToast("You must be logged in to delete blogs.", "error");
        return;
    }

    let localBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const blogToDelete = localBlogs.find(b => b.id === id);
    if (!blogToDelete || blogToDelete.author !== currentUser.username) {
        showToast("You are not authorized to delete this blog.", "error");
        return;
    }

    if (!confirm("Delete this blog?")) return;

    localBlogs = localBlogs.filter(blog => blog.id !== id);
    localStorage.setItem("blogs", JSON.stringify(localBlogs));
    showToast("Blog deleted successfully.");

    if (window.location.pathname.includes("of.html")) {
        window.location.href = "index.html";
        return;
    }

    renderHomepageBlogs();
    renderBlogs();
    updateCategoryCounts();
}

function editBlog(id) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        showToast("You must be logged in to edit blogs.", "error");
        return;
    }

    const localBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const blog = localBlogs.find(b => b.id === id);
    if (!blog || blog.author !== currentUser.username) {
        showToast("You are not authorized to edit this blog.", "error");
        return;
    }

    localStorage.setItem("editingBlogId", id);

    document.getElementById("blogTitle").value = blog.title;
    document.getElementById("blogCategory").value = blog.category;
    document.getElementById("blogContent").value = blog.content;
    if (document.getElementById("blogImage")) {
        document.getElementById("blogImage").value = "";
    }

    const createBlogModal = document.getElementById("createBlogModal");
    if (!createBlogModal) return;

    const modalTitle = createBlogModal.querySelector("h2");
    if (modalTitle) modalTitle.textContent = "Edit Blog";
    const submitBtn = createBlogModal.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.textContent = "Save Changes";

    createBlogModal.classList.add("active");
}

const signupModal = document.getElementById("signupModal");
const loginModal = document.getElementById("loginModal");
const createBlogModal = document.getElementById("createBlogModal");
const logoutBtn = document.getElementById("logoutBtn");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const createBlogBtn = document.getElementById("createBlogBtn");

// ===== NAVIGATION FUNCTIONS (Separate) =====
// Navigate from Signup to Login with smooth transition
function navigateToLogin() {
    if (signupModal) {
        signupModal.classList.remove('active');
        setTimeout(() => {
            if (loginModal) {
                loginModal.classList.add('active');
                if (signupForm) signupForm.reset();
            }
        }, 300);
    }
}

// Navigate from Login to Signup with smooth transition
function navigateToSignup() {
    if (loginModal) {
        loginModal.classList.remove('active');
        setTimeout(() => {
            if (signupModal) {
                signupModal.classList.add('active');
                if (loginForm) loginForm.reset();
            }
        }, 300);
    }
}

// ===== OPEN FUNCTIONS =====
function openSignupModalEnhanced() {
    if (signupModal) {
        signupModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (loginForm) loginForm.reset();
    }
}

function openLoginModalEnhanced() {
    if (loginModal) {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (signupForm) signupForm.reset();
    }
}

function closeModalEnhanced(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (modal === signupModal && signupForm) signupForm.reset();
        if (modal === loginModal && loginForm) loginForm.reset();
    }
}

function closeAllModalsEnhanced() {
    closeModalEnhanced(signupModal);
    closeModalEnhanced(loginModal);
    if (createBlogModal) createBlogModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== EVENT LISTENERS =====
// Open buttons
if (signupBtn && signupModal) {
    signupBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openSignupModalEnhanced();
    });
}

if (loginBtn && loginModal) {
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openLoginModalEnhanced();
    });
}

if (createBlogBtn && createBlogModal) {
    createBlogBtn.addEventListener("click", () => {
        localStorage.removeItem("editingBlogId");
        const form = document.getElementById("blogForm");
        if (form) form.reset();
        
        const modalTitle = createBlogModal.querySelector("h2");
        if (modalTitle) modalTitle.textContent = "Create Blog";
        const submitBtn = createBlogModal.querySelector("button[type='submit']");
        if (submitBtn) submitBtn.textContent = "Publish Blog";
        
        createBlogModal.classList.add("active");
    });
}

// Close buttons
document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (signupModal) closeModalEnhanced(signupModal);
        if (loginModal) closeModalEnhanced(loginModal);
        if (createBlogModal) createBlogModal.classList.remove("active");
        
        const injectedModal = document.getElementById("createBlogModal");
        if (injectedModal) injectedModal.classList.remove("active");
    });
});

// Click outside to close
window.addEventListener("click", (e) => {
    if (signupModal && e.target === signupModal) {
        closeModalEnhanced(signupModal);
    }
    if (loginModal && e.target === loginModal) {
        closeModalEnhanced(loginModal);
    }
    const injectedModal = document.getElementById("createBlogModal");
    if (injectedModal && e.target === injectedModal) {
        injectedModal.classList.remove("active");
    }
});

// ===== ADD SWITCH LINKS IF MISSING =====
document.addEventListener('DOMContentLoaded', function() {
    // Add switch link to signup modal if not exists
    const signupModalBox = document.querySelector('#signupModal .auth-box');
    if (signupModalBox) {
        const existingSwitch = signupModalBox.querySelector('.switch-form');
        if (!existingSwitch) {
            const switchDiv = document.createElement('div');
            switchDiv.className = 'switch-form';
            switchDiv.innerHTML = `Already have an account? <a id="switchToLogin" style="cursor: pointer; color: #16a34a; font-weight: 700; text-decoration: none;">Login</a>`;
            signupModalBox.appendChild(switchDiv);
        }
    }
    
    // Add switch link to login modal if not exists
    const loginModalBox = document.querySelector('#loginModal .auth-box');
    if (loginModalBox) {
        const existingSwitch = loginModalBox.querySelector('.switch-form');
        if (!existingSwitch) {
            const switchDiv = document.createElement('div');
            switchDiv.className = 'switch-form';
            switchDiv.innerHTML = `Don't have an account? <a id="switchToSignup" style="cursor: pointer; color: #16a34a; font-weight: 700; text-decoration: none;">Sign Up</a>`;
            loginModalBox.appendChild(switchDiv);
        }
    }
    
    // Event listeners for switch links
    const switchToLogin = document.getElementById('switchToLogin');
    const switchToSignup = document.getElementById('switchToSignup');
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navigateToLogin();
        });
    }
    
    if (switchToSignup) {
        switchToSignup.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navigateToSignup();
        });
    }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault();
        closeAllModalsEnhanced();
        openLoginModalEnhanced();
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        closeAllModalsEnhanced();
        openSignupModalEnhanced();
    }
    if (e.key === 'Escape') {
        closeAllModalsEnhanced();
    }
});

// ===== EXPOSE GLOBALLY =====
window.authNavigation = {
    navigateToLogin: navigateToLogin,
    navigateToSignup: navigateToSignup,
    openSignup: openSignupModalEnhanced,
    openLogin: openLoginModalEnhanced,
    closeModal: closeModalEnhanced,
    closeAll: closeAllModalsEnhanced
};

console.log('✅ Enhanced auth navigation initialized');

// ===== SIGNUP FORM - Enhanced with navigation =====
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("signupUsername").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.find(user => user.email === email)) {
            showToast("Account already exists", "error");
            return;
        }

        users.push({ id: Date.now(), username, email, password });
        localStorage.setItem("users", JSON.stringify(users));

        showToast("Signup successful! Please log in.");
        // Use enhanced navigation
        navigateToLogin();
        signupForm.reset();
    });
}

// ===== LOGIN FORM - Enhanced with navigation =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            showToast("Invalid email or password", "error");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        showToast(`Welcome ${user.username}!`);
        updateAuthUI();
        closeModalEnhanced(loginModal);
        loginForm.reset();
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        updateAuthUI();
        showToast("Logged out successfully");
    });
}
// ============================================================
// PASSWORD TOGGLE - Add this after your auth modal code
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced password toggle with visual feedback
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('data-target');
            if (!targetId) return;
            
            const input = document.getElementById(targetId);
            if (!input) return;
            
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                if (icon) {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
                // Visual feedback
                this.style.color = '#16a34a';
                this.style.transform = 'translateY(-50%) scale(1.05)';
                this.style.transition = 'all 0.2s ease';
            } else {
                input.type = 'password';
                if (icon) {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
                this.style.color = '';
                this.style.transform = 'translateY(-50%) scale(1)';
            }
            
            // Reset transform after animation
            setTimeout(() => {
                this.style.transform = 'translateY(-50%)';
            }, 200);
        });
    });
    
    console.log('✅ Password toggle initialized');
});

const blogForm = document.getElementById("blogForm");
if (blogForm) {
    blogForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            showToast("You must be logged in to manage blogs.", "error");
            return;
        }

        const title = document.getElementById("blogTitle").value.trim();
        const category = document.getElementById("blogCategory").value.trim();
        const content = document.getElementById("blogContent").value.trim();
        const imageInput = document.getElementById("blogImage");
        const editingId = localStorage.getItem("editingBlogId");

        const saveBlog = (imageDataUrl) => {
            let localBlogs = JSON.parse(localStorage.getItem("blogs")) || [];

            if (editingId) {
                const blogIndex = localBlogs.findIndex(b => b.id === Number(editingId));
                if (blogIndex !== -1) {
                    localBlogs[blogIndex].title = title;
                    localBlogs[blogIndex].category = category;
                    localBlogs[blogIndex].content = content;
                    if (imageDataUrl) localBlogs[blogIndex].image = imageDataUrl;
                    localStorage.setItem("blogs", JSON.stringify(localBlogs));
                    showToast("Blog updated successfully!");
                }
            } else {
                const now = new Date();
                const formattedDate = now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
                
                localBlogs.push({
                    id: Date.now(),
                    title,
                    category,
                    content,
                    author: currentUser.username,
                    image: imageDataUrl || "", 
                    date: formattedDate
                });
                localStorage.setItem("blogs", JSON.stringify(localBlogs));
                showToast("Blog published successfully!");
            }

            localStorage.removeItem("editingBlogId");
            const modal = document.getElementById("createBlogModal");
            if (modal) modal.classList.remove("active");
            blogForm.reset();

            renderHomepageBlogs();
            renderBlogs();
            updateCategoryCounts();
        };

        if (imageInput && imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => saveBlog(event.target.result);
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            let existingImage = null;
            if (editingId) {
                const localBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
                const blog = localBlogs.find(b => b.id === Number(editingId));
                if (blog) existingImage = blog.image;
            }
            saveBlog(existingImage);
        }
    });
}

function updateAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const welcomeUser = document.getElementById("welcomeUser");
    const usernameDisplay = document.getElementById("usernameDisplay");

    if (welcomeUser && usernameDisplay) {
        if (currentUser) {
            usernameDisplay.textContent = currentUser.username;
            welcomeUser.style.display = "inline-block";
        } else {
            welcomeUser.style.display = "none";
        }
    }

    if (currentUser) {
        if (signupBtn) signupBtn.style.display = "none";
        if (loginBtn) loginBtn.style.display = "none";
        if (createBlogBtn) createBlogBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        if (signupBtn) signupBtn.style.display = "inline-block";
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (createBlogBtn) createBlogBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
    }

    renderHomepageBlogs();
    renderBlogs();
}

function searchBlogs() {
    const searchInput = document.getElementById("sidebarSearch");
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    
    const allBlogsGrid = document.getElementById("allBlogsGrid");
    const blogGrid = document.getElementById("blogGrid");

    const localBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const staticBlogs = typeof blogs !== "undefined" ? blogs : [];
    const allBlogs = [...localBlogs, ...staticBlogs].sort((a, b) => b.id - a.id);

    const filteredBlogs = allBlogs.filter(blog => 
        (blog.title && blog.title.toLowerCase().includes(query)) ||
        (blog.category && blog.category.toLowerCase().includes(query)) ||
        (blog.content && blog.content.toLowerCase().includes(query))
    );

    if (allBlogsGrid) {
        if (filteredBlogs.length === 0) {
            allBlogsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 20px;">No blogs match your search "${sanitizeInput(query)}".</p>`;
        } else {
            allBlogsGrid.innerHTML = filteredBlogs.map(createBlogCard).join("");
        }
    } else if (blogGrid) {
        if (filteredBlogs.length === 0) {
            blogGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 20px;">No blogs match your search "${sanitizeInput(query)}".</p>`;
        } else {
            blogGrid.innerHTML = filteredBlogs.slice(0, 3).map(createBlogCard).join("");
        }
    }
}

function updateCategoryCounts() {
    const localBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const staticBlogs = typeof blogs !== "undefined" ? blogs : [];
    const allBlogs = [...localBlogs, ...staticBlogs];

    const counts = { "Agriculture": 0, "Technology": 0, "Lifestyle": 0, "Programming": 0, "Development": 0, "Travel": 0 };

    allBlogs.forEach(blog => {
        if (blog.category) {
            for (const key in counts) {
                if (blog.category.toLowerCase().trim() === key.toLowerCase()) {
                    counts[key]++;
                }
            }
        }
    });

    document.querySelectorAll(".category-item").forEach(item => {
        const text = item.textContent.toLowerCase();
        for (const key in counts) {
            if (text.includes(key.toLowerCase())) {
                const countSpan = item.querySelector(".category-count");
                if (countSpan) countSpan.textContent = counts[key];
            }
        }
    });
}

function filterByCategory(categoryName) {
    const allBlogsGrid = document.getElementById("allBlogsGrid");
    const blogGrid = document.getElementById("blogGrid");

    const localBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const staticBlogs = typeof blogs !== "undefined" ? blogs : [];
    const allBlogs = [...localBlogs, ...staticBlogs].sort((a, b) => b.id - a.id);

    const filteredBlogs = allBlogs.filter(blog => 
        blog.category && blog.category.toLowerCase().trim() === categoryName.toLowerCase().trim()
    );

    if (allBlogsGrid) {
        if (filteredBlogs.length === 0) {
            allBlogsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 20px;">No blogs in category "${sanitizeInput(categoryName)}".</p>`;
        } else {
            allBlogsGrid.innerHTML = filteredBlogs.map(createBlogCard).join("");
        }
    } else if (blogGrid) {
        if (filteredBlogs.length === 0) {
            blogGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 20px;">No blogs in category "${sanitizeInput(categoryName)}".</p>`;
        } else {
            blogGrid.innerHTML = filteredBlogs.slice(0, 3).map(createBlogCard).join("");
        }
    }
}

// Initializing event triggers synchronously within DOM processing sequence
document.addEventListener("DOMContentLoaded", () => {
    commentsElement = document.querySelector("#comments");
    commentTextarea = document.querySelector("#comment");
    usernameInput = document.querySelector("#username");

    const searchInput = document.getElementById("sidebarSearch");
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") searchBlogs();
        });
    }

    document.querySelectorAll(".category-item").forEach(item => {
        item.style.cursor = "pointer";
        item.addEventListener("click", () => {
            const cleanText = item.querySelector("span:first-child").textContent
                .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
                .trim();
            filterByCategory(cleanText);
        });
    });

    const savedUsername = localStorage.getItem("username") || "";
    if (usernameInput && savedUsername) {
        usernameInput.value = savedUsername;
    }

    updateAuthUI();
    renderComments();
    updateCategoryCounts();
});

// ============================================================
// GLOBAL XSS SANITIZATION UTILITY (Fixes Issue #4360)
// ============================================================
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

const commentsElement = document.querySelector("#comments");
const commentTextarea = document.querySelector("#comment");
const usernameInput = document.querySelector("#username");

let liked = JSON.parse(localStorage.getItem("liked")) || false;
let bookmarked = JSON.parse(localStorage.getItem("bookmarked")) || false;
let comments = JSON.parse(localStorage.getItem("comments")) || [];

const savedUsername = localStorage.getItem("username") || "";
if (usernameInput && savedUsername) {
    usernameInput.value = savedUsername;
}

const showToast = (message, type = "success") => {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) return;

    const icons = {
        success: "✅",
        info: "ℹ️",
        error: "❌",
    };

    const toast = document.createElement("div");
    toast.className = "flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white bg-gray-800 dark:bg-gray-700 animate-[fadeInUp_0.3s_ease] transition-all duration-300";

    toast.innerHTML = `
        <span>${icons[type] || icons.success}</span>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

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
                    title: "Organic Farming Blog",
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

renderComments();

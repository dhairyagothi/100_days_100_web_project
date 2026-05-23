const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

let darkMode =
    JSON.parse(localStorage.getItem("darkMode")) || false;

const updateTheme = () => {
    if (darkMode) {
        document.documentElement.classList.add("dark");

        themeIcon.innerHTML = `
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v1.5m0 15V21m8.485-8.485H19M5 12H3m14.485
                6.364-1.06-1.06M7.575 7.575 6.515 6.515m10.97
                0-1.06 1.06M7.575 16.425l-1.06 1.06M15 12a3
                3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
        `;
    } else {
        document.documentElement.classList.remove("dark");

        themeIcon.innerHTML = `
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385
                0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.752-3.752A9.753
                9.753 0 1 0 21.752 15.002Z"
            />
        `;
    }
};

updateTheme();

themeToggle.addEventListener("click", () => {
    darkMode = !darkMode;

    localStorage.setItem(
        "darkMode",
        JSON.stringify(darkMode)
    );

    updateTheme();
});

const commentsElement = document.querySelector("#comments");
const commentTextarea = document.querySelector("#comment");
const usernameInput = document.querySelector("#username");

// =======================
// LOCAL STORAGE DATA
// =======================

let liked = JSON.parse(localStorage.getItem("liked")) || false;

let bookmarked =
    JSON.parse(localStorage.getItem("bookmarked")) || false;

let comments =
    JSON.parse(localStorage.getItem("comments")) || [];

// Restore saved username so users don't have to retype it
const savedUsername = localStorage.getItem("username") || "";
if (usernameInput && savedUsername) {
    usernameInput.value = savedUsername;
}

// =======================
// TOAST NOTIFICATIONS
// =======================

/**
 * Shows a brief toast message at the bottom of the screen.
 * @param {string} message - Text to display
 * @param {"success"|"info"|"error"} type - Controls icon and color
 */
const showToast = (message, type = "success") => {
    const toastContainer = document.getElementById("toastContainer");

    const icons = {
        success: "✅",
        info: "ℹ️",
        error: "❌",
    };

    const toast = document.createElement("div");

    toast.className = `
        flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
        text-white bg-gray-800 dark:bg-gray-700
        animate-[fadeInUp_0.3s_ease]
        transition-all duration-300
    `;

    toast.innerHTML = `
        <span>${icons[type] || icons.success}</span>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Fade out and remove after 2.8 seconds
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";

        setTimeout(() => toast.remove(), 300);
    }, 2800);
};

// =======================
// READING PROGRESS BAR
// =======================

const progressBar = document.getElementById("progressBar");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = `${progress}%`;
});

// =======================
// LIKE BUTTON
// =======================

const likeOutline = document.getElementById("like");
const likeFill = document.getElementById("liked");

const updateLikeUI = () => {
    if (liked) {
        likeOutline.classList.add("hidden");
        likeFill.classList.remove("hidden");
    } else {
        likeOutline.classList.remove("hidden");
        likeFill.classList.add("hidden");
    }
};

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

// =======================
// BOOKMARK BUTTON
// =======================

const bookmarkOutline = document.getElementById("bookmark");
const bookmarkFill = document.getElementById("bookmarked");

const updateBookmarkUI = () => {
    if (bookmarked) {
        bookmarkOutline.classList.add("hidden");
        bookmarkFill.classList.remove("hidden");
    } else {
        bookmarkOutline.classList.remove("hidden");
        bookmarkFill.classList.add("hidden");
    }
};

updateBookmarkUI();

bookmarkOutline.addEventListener("click", () => {
    bookmarked = true;

    localStorage.setItem(
        "bookmarked",
        JSON.stringify(bookmarked)
    );

    updateBookmarkUI();
    showToast("Post bookmarked!");
});

bookmarkFill.addEventListener("click", () => {
    bookmarked = false;

    localStorage.setItem(
        "bookmarked",
        JSON.stringify(bookmarked)
    );

    updateBookmarkUI();
    showToast("Bookmark removed.", "info");
});

// =======================
// SHARE BUTTON
// =======================

const shareButton = document.getElementById("share");

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
            await navigator.clipboard.writeText(
                window.location.href
            );
            showToast("Link copied to clipboard!", "info");
        }
    } catch (error) {
        // User cancelled the share dialog — no need to show an error
        console.log(error);
    }
});

// =======================
// RENDER COMMENTS
// =======================

const renderComments = () => {
    commentsElement.innerHTML = "";

    if (comments.length === 0) {
        commentsElement.innerHTML = `
            <p id="emptyMessage">No comments yet</p>
        `;

        return;
    }

    comments.forEach((commentObj, index) => {
        const commentElement = document.createElement("div");

        commentElement.className =
            "bg-gray-100 dark:bg-gray-700 rounded-xl p-4 shadow-sm transition duration-300";

        commentElement.innerHTML = `
            <div class="flex justify-between items-start gap-2">
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                        ${commentObj.author || "Anonymous"}
                    </p>

                    <p class="text-gray-700 dark:text-gray-200 break-words" id="comment-text-${index}">
                        ${commentObj.text}
                    </p>

                    <!-- Edit input (hidden by default) -->
                    <textarea
                        id="edit-input-${index}"
                        class="hidden w-full mt-2 p-2 text-sm border border-emerald-300 dark:border-gray-500
                               rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400
                               bg-white dark:bg-gray-600 text-black dark:text-white resize-none"
                        rows="2"
                    >${commentObj.text}</textarea>

                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        ${commentObj.date ? commentObj.date + " · " : ""}${commentObj.time}
                    </p>
                </div>

                <div class="flex items-center gap-2 flex-shrink-0">
                    <button
                        class="like-comment text-pink-500 hover:scale-110 transition"
                        data-index="${index}"
                    >
                        ❤️ <span class="like-count">${commentObj.likes}</span>
                    </button>

                    <button
                        class="edit-btn text-blue-400 hover:text-blue-600 transition text-sm"
                        data-index="${index}"
                        title="Edit comment"
                    >
                        ✏️
                    </button>

                    <button
                        class="delete-btn text-red-500 hover:text-red-700 transition"
                        data-index="${index}"
                        title="Delete comment"
                    >
                        🗑
                    </button>
                </div>
            </div>

            <!-- Save / Cancel buttons for edit mode (hidden by default) -->
            <div id="edit-actions-${index}" class="hidden mt-2">
                <button
                    class="save-edit-btn text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg transition"
                    data-index="${index}"
                >
                    Save
                </button>
                <button
                    class="cancel-edit-btn text-xs bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-1 rounded-lg transition"
                    data-index="${index}"
                >
                    Cancel
                </button>
            </div>
        `;

        commentsElement.appendChild(commentElement);
    });

    // =======================
    // DELETE COMMENT
    // =======================

    document.querySelectorAll(".delete-btn")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const index = button.dataset.index;

                comments.splice(index, 1);

                localStorage.setItem(
                    "comments",
                    JSON.stringify(comments)
                );

                renderComments();
                showToast("Comment deleted.", "info");
            });
        });

    // =======================
    // LIKE COMMENT
    // =======================

    document.querySelectorAll(".like-comment")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const index = button.dataset.index;

                comments[index].likes++;

                localStorage.setItem(
                    "comments",
                    JSON.stringify(comments)
                );

                renderComments();
            });
        });

    // =======================
    // EDIT COMMENT
    // =======================

    document.querySelectorAll(".edit-btn")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const index = button.dataset.index;

                // Toggle into edit mode
                document.getElementById(`comment-text-${index}`)
                    .classList.add("hidden");
                document.getElementById(`edit-input-${index}`)
                    .classList.remove("hidden");
                const actions = document.getElementById(`edit-actions-${index}`);
                actions.classList.remove("hidden");
                actions.classList.add("flex", "gap-2");

                // Focus the textarea and move cursor to end
                const editInput = document.getElementById(
                    `edit-input-${index}`
                );
                editInput.focus();
                editInput.setSelectionRange(
                    editInput.value.length,
                    editInput.value.length
                );
            });
        });

    document.querySelectorAll(".save-edit-btn")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const index = button.dataset.index;
                const newText = document
                    .getElementById(`edit-input-${index}`)
                    .value.trim();

                if (newText === "") {
                    showToast("Comment cannot be empty.", "error");
                    return;
                }

                comments[index].text = newText;

                localStorage.setItem(
                    "comments",
                    JSON.stringify(comments)
                );

                renderComments();
                showToast("Comment updated!");
            });
        });

    document.querySelectorAll(".cancel-edit-btn")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const index = button.dataset.index;

                // Restore original text and hide edit mode
                document.getElementById(`edit-input-${index}`)
                    .value = comments[index].text;
                document.getElementById(`comment-text-${index}`)
                    .classList.remove("hidden");
                document.getElementById(`edit-input-${index}`)
                    .classList.add("hidden");
                const actions = document.getElementById(`edit-actions-${index}`);
                actions.classList.add("hidden");
                actions.classList.remove("flex", "gap-2");
            });
        });
};

// =======================
// ADD COMMENT
// =======================

const addComment = () => {
    const comment = commentTextarea.value.trim();

    if (comment === "") {
        showToast("Please write a comment first.", "error");
        return;
    }

    // Save username for next time
    const author = usernameInput
        ? usernameInput.value.trim() || "Anonymous"
        : "Anonymous";

    if (usernameInput && usernameInput.value.trim()) {
        localStorage.setItem("username", usernameInput.value.trim());
    }

    const now = new Date();

    const currentTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const currentDate = now.toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const commentData = {
        text: comment,
        author: author,
        time: currentTime,
        date: currentDate,
        likes: 0,
    };

    comments.push(commentData);

    localStorage.setItem(
        "comments",
        JSON.stringify(comments)
    );

    commentTextarea.value = "";

    renderComments();
    showToast("Comment added!");
};

// =======================
// INITIAL RENDER
// =======================

renderComments();





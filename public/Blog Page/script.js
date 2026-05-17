const commentsElement = document.querySelector("#comments");
const commentTextarea = document.querySelector("#comment");

// =======================
// LOCAL STORAGE DATA
// =======================

let liked = JSON.parse(localStorage.getItem("liked")) || false;

let bookmarked =
    JSON.parse(localStorage.getItem("bookmarked")) || false;

let comments =
    JSON.parse(localStorage.getItem("comments")) || [];

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
});

likeFill.addEventListener("click", () => {
    liked = false;

    localStorage.setItem("liked", JSON.stringify(liked));

    updateLikeUI();
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
});

bookmarkFill.addEventListener("click", () => {
    bookmarked = false;

    localStorage.setItem(
        "bookmarked",
        JSON.stringify(bookmarked)
    );

    updateBookmarkUI();
});

// =======================
// SHARE BUTTON
// =======================

const shareButton =
    document.querySelectorAll(".cursor-pointer")[2];

shareButton.addEventListener("click", async () => {
    try {
        if (navigator.share) {
            await navigator.share({
                title: "Organic Farming Blog",
                text: "Check out this blog page!",
                url: window.location.href,
            });
        } else {
            await navigator.clipboard.writeText(
                window.location.href
            );

            alert("Blog link copied to clipboard!");
        }
    } catch (error) {
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
            "bg-gray-100 rounded-xl p-4 shadow-sm";

        commentElement.innerHTML = `
            <div class="flex justify-between items-start gap-2">
                <div>
                    <p class="text-gray-700 break-words">
                        ${commentObj.text}
                    </p>

                    <p class="text-sm text-gray-500 mt-2">
                        ${commentObj.time}
                    </p>
                </div>

                <div class="flex items-center gap-3">
                    <button class="like-comment text-pink-500 hover:scale-110 transition"
                        data-index="${index}">
                        ❤️ 
                        <span class="like-count">
                            ${commentObj.likes}
                        </span>
                    </button>

                    <button class="delete-btn text-red-500 hover:text-red-700 transition"
                        data-index="${index}">
                        🗑
                    </button>
                </div>
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
};

// =======================
// ADD COMMENT
// =======================

const addComment = () => {
    const comment = commentTextarea.value.trim();

    if (comment === "") {
        alert("Please write a comment first.");
        return;
    }

    const currentTime =
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    const commentData = {
        text: comment,
        time: currentTime,
        likes: 0,
    };

    comments.push(commentData);

    localStorage.setItem(
        "comments",
        JSON.stringify(comments)
    );

    commentTextarea.value = "";

    renderComments();
};

// =======================
// INITIAL RENDER
// =======================

renderComments();
const commentsElement = document.querySelector("#comments");
const commentTextarea = document.querySelector("#comment");

const addComment = () => {
  const comment = commentTextarea.value;
  if (comment === "") {
    return;
  }
  const commentElement = document.createElement("div");
  commentElement.innerHTML = `
        <div class="p-3 bg-gray-100 rounded-md mt-2">
            <p class="text-gray-600">${comment}</p>
        </div>
    `;
  commentsElement.appendChild(commentElement);
  commentTextarea.value = "";
};

let liked = false 

const likeOutline = document.getElementById("like")
const likeFill = document.getElementById("liked")

likeOutline.addEventListener("click", () => {
    liked = true
    likeOutline.classList.add("hidden")
    likeFill.classList.remove("hidden")
})

likeFill.addEventListener("click", () => {
    liked = false
    likeOutline.classList.remove("hidden")
    likeFill.classList.add("hidden")
})

let bookmarked = false

const bookmarkOutline = document.getElementById("bookmark")
const bookmarkFill = document.getElementById("bookmarked")

bookmarkOutline.addEventListener("click", () => {
    bookmarked = true
    bookmarkOutline.classList.add("hidden")
    bookmarkFill.classList.remove("hidden")
})

bookmarkFill.addEventListener("click", () => {
    bookmarked = false
    bookmarkOutline.classList.remove("hidden")
    bookmarkFill.classList.add("hidden")
})

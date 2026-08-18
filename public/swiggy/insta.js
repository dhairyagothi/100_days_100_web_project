document.body.style.margin = "0";

// Single root container everything mounts into
const appRoot = document.createElement("div");
appRoot.classList.add("app_root");
document.body.appendChild(appRoot);

// ============================================================
// HERO / TOP MENU
// ============================================================

const topMenu = document.createElement("div");
topMenu.classList.add("top_menu");

const heroTop = document.createElement("div");
heroTop.classList.add("hero_top");

const brandMark = document.createElement("div");
brandMark.classList.add("brand_mark");
brandMark.textContent = "instamart";

const loginCircle = document.createElement("div");
loginCircle.classList.add("login_circle");
const userIcon = document.createElement("i");
userIcon.classList.add("fa", "fa-user"); // fixed: was "fa-pet"
loginCircle.appendChild(userIcon);

heroTop.appendChild(brandMark);
heroTop.appendChild(loginCircle);

const tagline = document.createElement("p");
tagline.classList.add("tagline");
tagline.textContent = "Groceries, snacks and everyday essentials, delivered to your door.";

const deliveryBadge = document.createElement("div");
deliveryBadge.classList.add("delivery_badge");
const pulseDot = document.createElement("span");
pulseDot.classList.add("pulse_dot");
deliveryBadge.appendChild(pulseDot);
deliveryBadge.appendChild(document.createTextNode("Delivery in 10 minutes"));

const searchRow = document.createElement("div");
searchRow.classList.add("search_row");

const searchIcon = document.createElement("i");
searchIcon.classList.add("fa", "fa-search");

const searchInput = document.createElement("input");
searchInput.setAttribute("type", "search");
searchInput.setAttribute("placeholder", "Search for atta, dals, cold drinks...");
searchInput.setAttribute("aria-label", "Search categories");

searchRow.appendChild(searchIcon);
searchRow.appendChild(searchInput);

topMenu.appendChild(heroTop);
topMenu.appendChild(tagline);
topMenu.appendChild(deliveryBadge);
topMenu.appendChild(searchRow);

appRoot.appendChild(topMenu);

const searchEmptyMsg = document.createElement("p");
searchEmptyMsg.classList.add("search_empty_msg");
searchEmptyMsg.textContent = "No categories match your search.";
appRoot.appendChild(searchEmptyMsg);

// ============================================================
// CATEGORIES
// ============================================================

const shopDiv = document.createElement("div");
shopDiv.classList.add("shop");

const shopEyebrow = document.createElement("p");
shopEyebrow.classList.add("eyebrow");
shopEyebrow.textContent = "BROWSE";

const shopHeading = document.createElement("h3");
shopHeading.textContent = "Shop by category";

shopDiv.appendChild(shopEyebrow);
shopDiv.appendChild(shopHeading);
appRoot.appendChild(shopDiv);

const lineDiv = document.createElement("div");
lineDiv.classList.add("line");
appRoot.appendChild(lineDiv);

const itemsDiv = document.createElement("div");
itemsDiv.classList.add("items");

const categories = [
  { src: "image/frui2.avif", text: "Fresh Fruit" },
  { src: "image/veg.avif", text: "Fresh Vegetables" },
  { src: "image/fruit4.avif", text: "Atta, Rice and Dals" },
  { src: "image/fruit5.avif", text: "Masalas and Dry Fruits" },
  { src: "image/fruit3.avif", text: "Dairy, Bread and Eggs" },
  { src: "image/frui5.avif", text: "Oils and Ghee" },
  { src: "image/frui9.avif", text: "Meat and Seafood" },
  { src: "image/fruit6.avif", text: "Munchies" },
  { src: "image/fruit8.avif", text: "Cold Drinks and Juices" },
  { src: "image/fruit7.avif", text: "Sweet Tooth" },
  { src: "image/baby.avif", text: "Baby Care" },
  { src: "image/bath.avif", text: "Bath, Body and Hair" },
  { src: "image/beauty.avif", text: "Beauty and Grooming" },
  { src: "image/cereal.avif", text: "Cereal and Breakfast" },
  { src: "image/cleaning.avif", text: "Cleaning Essentials" },
  { src: "image/home.avif", text: "Home and Kitchen" },
  { src: "image/hygiene.avif", text: "Hygiene and Wellness" },
  { src: "image/instantfood.avif", text: "Instant and Frozen Food" },
  { src: "image/office.avif", text: "Office and Electricals" },
  { src: "image/paan.avif", text: "Paan Corner" },
  { src: "image/sauces.avif", text: "Sauces and Spreads" },
  { src: "image/tea.avif", text: "Tea, Coffee and More" },
  { src: "image/pet.avif", text: "Pet Supplies" },
  { src: "image/biscuits.avif", text: "Biscuits and Cakes" },
];

categories.forEach((category) => {
  const box = document.createElement("div");
  box.classList.add("box");
  box.dataset.label = category.text.toLowerCase();

  const img = document.createElement("img");
  img.src = category.src;
  img.alt = category.text;
  img.loading = "lazy";
  box.appendChild(img);

  const heading = document.createElement("h2");
  heading.textContent = category.text;

  box.appendChild(heading);
  itemsDiv.appendChild(box);
});

appRoot.appendChild(itemsDiv);

// Live search: filter category cards as the user types
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  document.querySelectorAll(".box").forEach((box) => {
    const matches = query === "" || box.dataset.label.includes(query);
    box.classList.toggle("hidden", !matches);
    if (matches) visibleCount++;
  });

  searchEmptyMsg.style.display = visibleCount === 0 ? "block" : "none";
});

// ============================================================
// COMMENTS / REVIEWS SECTION
// ============================================================

const commentsSection = document.createElement("div");
commentsSection.classList.add("comments_section");

const commentsTitle = document.createElement("h2");
commentsTitle.textContent = "Customer reviews";
commentsSection.appendChild(commentsTitle);

const commentBox = document.createElement("div");
commentBox.classList.add("comment_box");

const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.placeholder = "Enter your name";
nameInput.setAttribute("aria-label", "Your name");

const commentInput = document.createElement("textarea");
commentInput.placeholder = "Write your review...";
commentInput.setAttribute("aria-label", "Your review");

const commentButton = document.createElement("button");
commentButton.textContent = "Post review";

commentBox.appendChild(nameInput);
commentBox.appendChild(commentInput);
commentBox.appendChild(commentButton);
commentsSection.appendChild(commentBox);

const commentsContainer = document.createElement("div");
commentsContainer.classList.add("comments_container");
commentsSection.appendChild(commentsContainer);

const defaultReviews = [
  { name: "Aarav", review: "Very fast delivery and fresh products!" },
  { name: "Diya", review: "The vegetables were fresh and nicely packed." },
  { name: "Rahul", review: "Amazing discounts and smooth experience." },
  { name: "Sneha", review: "Loved the dairy products quality." },
];

function buildReviewCard(name, review, removable) {
  const commentCard = document.createElement("div");
  commentCard.classList.add("comment_card");

  const userName = document.createElement("h3");
  userName.textContent = name;

  const userComment = document.createElement("p");
  userComment.textContent = review;

  commentCard.appendChild(userName);
  commentCard.appendChild(userComment);

  if (removable) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete_btn");
    deleteBtn.addEventListener("click", () => commentCard.remove());
    commentCard.appendChild(deleteBtn);
  }

  return commentCard;
}

defaultReviews.forEach((item) => {
  commentsContainer.appendChild(buildReviewCard(item.name, item.review, false));
});

commentButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();

  if (name === "" || comment === "") {
    alert("Please fill all fields");
    return;
  }

  commentsContainer.prepend(buildReviewCard(name, comment, true));

  nameInput.value = "";
  commentInput.value = "";
});

appRoot.appendChild(commentsSection);

// ============================================================
// FOOTER
// ============================================================

const footer = document.createElement("div");
footer.classList.add("footer");

const appBanner = document.createElement("img");
appBanner.src = "image/App_download_banner.avif";
appBanner.alt = "Download the app";

const footerLogo = document.createElement("img");
footerLogo.src = "image/swiggy_name.avif";
footerLogo.alt = "Instamart";
footerLogo.classList.add("footer_logo");

footer.appendChild(appBanner);
footer.appendChild(footerLogo);

const footerContainer = document.createElement("div");
footerContainer.classList.add("container");

const footerColumns = [
  {
    title: "Categories",
    items: [
      "Office",
      "Office in Delhi",
      "Office in Mumbai",
      "Office in Kolkata",
      "Dairy, Bread and Eggs",
      "Office and Electricals",
      "Beauty and Grooming",
    ],
  },
  {
    title: "We deliver to",
    items: ["Bangalore", "Delhi", "Mumbai", "Kolkata", "Jaipur", "Pune", "Kochi"],
  },
  {
    title: "Company",
    items: ["About", "Careers", "Team", "Swiggy Genie", "Swiggy One"],
  },
];

footerColumns.forEach((column) => {
  const columnDiv = document.createElement("div");
  columnDiv.classList.add("footer_list1");

  const columnTitle = document.createElement("h3");
  columnTitle.textContent = column.title;
  columnDiv.appendChild(columnTitle);

  column.items.forEach((item) => {
    const itemHeading = document.createElement("h4");
    itemHeading.textContent = item;
    columnDiv.appendChild(itemHeading);
  });

  footerContainer.appendChild(columnDiv);
});

footer.appendChild(footerContainer);

const iconsDiv = document.createElement("div");
iconsDiv.classList.add("icons");

const icons = ["bxl-facebook", "fa-shopping-cart", "bxl-twitter", "bxl-linkedin"];
icons.forEach((icon) => {
  const i = document.createElement("i");
  i.className = `bx ${icon}`;
  iconsDiv.appendChild(i);
});

footer.appendChild(iconsDiv);

// fixed: footer was being appended twice in the original script
appRoot.appendChild(footer);
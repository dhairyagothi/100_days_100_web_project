
document.body.style.margin = "0";


const topMenu = document.createElement("div");
topMenu.classList.add("top_menu");


const loginCircle = document.createElement("div");
loginCircle.classList.add("login_circle");

const userIcon = document.createElement("i");
userIcon.classList.add("fa", "fa-pet");
loginCircle.appendChild(userIcon);

const searchIcon = document.createElement("i");
searchIcon.classList.add("fa", "fa-search");

const searchInput = document.createElement("input");
searchInput.setAttribute("type", "search");
searchInput.setAttribute("placeholder", "Search for 'diapers'");


topMenu.appendChild(loginCircle);
topMenu.appendChild(searchIcon);
topMenu.appendChild(searchInput);

document.body.appendChild(topMenu);


const shopDiv = document.createElement("div");
shopDiv.classList.add("shop");

const shopHeading = document.createElement("h3");
shopHeading.textContent = "SHOP BY CATEGORY";
shopDiv.appendChild(shopHeading);

document.body.appendChild(shopDiv);


const lineDiv = document.createElement("div");
lineDiv.classList.add("line");
document.body.appendChild(lineDiv);

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

  const img = document.createElement("img");
  img.src = category.src;
  box.appendChild(img);

  const heading = document.createElement("h2");
  heading.textContent = category.text;
  heading.style.fontWeight = "bold";
  heading.style.fontSize = "15px";

  box.appendChild(heading);
  itemsDiv.appendChild(box);
});

document.body.appendChild(itemsDiv);

const footer = document.createElement("div");
footer.classList.add("footer");

const appBanner = document.createElement("img");
appBanner.src = "../../image/App_download_banner.avif";

const footerLogo = document.createElement("img");
footerLogo.src = "../../image/swiggy_name.avif";
footerLogo.style.width = "30vh";
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
  columnTitle.style.color = "white";
  columnDiv.appendChild(columnTitle);

  column.items.forEach((item) => {
    const itemHeading = document.createElement("h4");
    itemHeading.textContent = item;
    columnDiv.appendChild(itemHeading);
  });

  footerContainer.appendChild(columnDiv);
});

footer.appendChild(footerContainer);

document.body.appendChild(footer);


const iconsDiv = document.createElement("div");
iconsDiv.classList.add("icons");

const icons = ["bxl-facebook", "fa-shopping-cart", "bxl-twitter", "bxl-linkedin"];
icons.forEach((icon) => {
  const i = document.createElement("i");
  i.className = `bx ${icon}`;
  i.style.color = "aliceblue";
  iconsDiv.appendChild(i);
});

footer.appendChild(iconsDiv);


document.body.appendChild(footer);

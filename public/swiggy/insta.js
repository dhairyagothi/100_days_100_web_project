
document.body.style.margin = "0";


const topMenu = document.createElement("div");
topMenu.classList.add("top_menu");

const headerContainer = document.createElement("div");  //header container 
headerContainer.classList.add("header_container");

const logoSection = document.createElement("div");     //logo section
logoSection.classList.add("logo_section");

const logoText = document.createElement("h2");
// logoText.textContent = "Instamart";                    //text 

const logo = document.createElement("img");

logo.src = "image/Instamart_Logo.png";

logo.style.height = "60px";

logoSection.appendChild(logo);


logoSection.appendChild(logoText);
 
const locationSection = document.createElement("div");
locationSection.classList.add("location_section");             //location section

const deliveryTime = document.createElement("h4");
deliveryTime.textContent = "18 Mins Delivery";              

const locationText = document.createElement("p");
locationText.textContent = "Select Location";

locationSection.appendChild(deliveryTime);
locationSection.appendChild(locationText);

locationSection.style.cursor = "pointer";

locationSection.addEventListener("click", () => {

    if (!navigator.geolocation) {
        locationText.textContent = "Location not supported";
        return;
    }

    locationText.textContent = "Fetching location...";

    navigator.geolocation.getCurrentPosition(
        async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );

                const data = await response.json();

                const city =
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    "Unknown City";

                const state =
                    data.address.state ||
                    "";

                locationText.textContent =
                    `${city}, ${state}`;

            } catch (error) {

                locationText.textContent =
                    "Location unavailable";

            }

        },

        () => {

            locationText.textContent =
                "Permission denied";

        }

    );

});


const searchSection = document.createElement("div");
searchSection.classList.add("search_section");      //search sec

const signInSection = document.createElement("div");              //signin sec
signInSection.classList.add("signin_section");


const signInBtn = document.createElement("button");
signInBtn.textContent = "Sign In";

signInBtn.addEventListener("click", () => {
    signInModal.style.display = "flex";
});




// const signInBtn = document.createElement("button");
// signInBtn.textContent = "Sign In";

signInSection.appendChild(signInBtn);

const cartSection = document.createElement("div");
cartSection.classList.add("cart_section");                          //cart section

// let cartCount = 0;

// cartBtn.textContent = `My Cart (${cartCount})`;

const cartBtn = document.createElement("button");
cartBtn.textContent = "My Cart";

cartSection.appendChild(cartBtn);



const searchIcon = document.createElement("i");
searchIcon.classList.add("fa", "fa-search");

const searchInput = document.createElement("input");
searchInput.setAttribute("type", "search");
searchInput.setAttribute("placeholder", "Search for 'diapers'");

searchSection.appendChild(searchIcon);
searchSection.appendChild(searchInput);


headerContainer.appendChild(logoSection);
headerContainer.appendChild(locationSection);
headerContainer.appendChild(searchSection);
headerContainer.appendChild(signInSection);
headerContainer.appendChild(cartSection);

// topMenu.appendChild(loginCircle);




topMenu.appendChild(headerContainer);

document.body.appendChild(topMenu);


const signInModal = document.createElement("div");
signInModal.classList.add("signin_modal");

signInModal.innerHTML = `
    <div class="signin_box">
        <span class="close_btn">&times;</span>

        <h2>Welcome Back</h2>

        <input type="email" placeholder="Enter Email">

        <input type="password" placeholder="Enter Password">

        <button class="login_btn">Login</button>

        

        <p>Don't have an account? Sign Up</p>
    </div>
`;

const loginBtn =
signInModal.querySelector(".login_btn");

loginBtn.addEventListener("click", async () => {

    alert("clicked");

});

const sliderContainer = document.createElement("div");
sliderContainer.classList.add("slider_container");

const sliderImage = document.createElement("img");
sliderImage.classList.add("slider_image");

const banners = [
    "image/banner1.avif",
    "image/banner2.avif",
    "image/banner3.avif",
    "image/banner4.avif"
];

let currentBanner = 0;

sliderImage.src = banners[currentBanner];

sliderContainer.appendChild(sliderImage);

document.body.appendChild(sliderContainer);

setInterval(() => {

    currentBanner++;

    if(currentBanner >= banners.length){
        currentBanner = 0;
    }

    sliderImage.src = banners[currentBanner];

}, 3000);


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

  box.dataset.category = category.text.toLowerCase();

  const img = document.createElement("img");
  img.src = category.src;
  box.appendChild(img);

  const heading = document.createElement("h2");
  heading.textContent = category.text;
  heading.style.fontWeight = "bold";
  heading.style.fontSize = "15px";

  box.appendChild(heading);
const addToCartBtn = document.createElement("button");

addToCartBtn.textContent = "Add To Cart";

addToCartBtn.classList.add("add_cart_btn");

addToCartBtn.addEventListener("click", () => {

    cartCount++;

    cartBtn.textContent = `My Cart (${cartCount})`;      
   


    


});

box.appendChild(addToCartBtn);




  itemsDiv.appendChild(box);
});

document.body.appendChild(itemsDiv);

searchInput.addEventListener("input", () => {

    const searchValue = searchInput.value.toLowerCase().trim();

    const allBoxes = document.querySelectorAll(".box");

    allBoxes.forEach((box) => {

        const categoryName = box.dataset.category;

        if (
            categoryName.includes(searchValue) ||
            searchValue === ""
        ) {
            box.style.display = "inline-block";
        } else {
            box.style.display = "none";
        }

    });

});

// COMMENTS SECTION

const commentsSection = document.createElement("div");
commentsSection.classList.add("comments_section");

const commentsTitle = document.createElement("h2");
commentsTitle.textContent = "Customer Reviews";

commentsSection.appendChild(commentsTitle);

// INPUT BOX

const commentBox = document.createElement("div");
commentBox.classList.add("comment_box");

const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.placeholder = "Enter your name";

const commentInput = document.createElement("textarea");
commentInput.placeholder = "Write your review...";

const commentButton = document.createElement("button");
commentButton.textContent = "Post Comment";

commentBox.appendChild(nameInput);
commentBox.appendChild(commentInput);
commentBox.appendChild(commentButton);

commentsSection.appendChild(commentBox);

// COMMENTS DISPLAY AREA

const commentsContainer = document.createElement("div");
commentsContainer.classList.add("comments_container");

commentsSection.appendChild(commentsContainer);
// DEFAULT CUSTOMER REVIEWS

const defaultReviews = [
    {
        name: "Aarav",
        review: "Very fast delivery and fresh products!"
    },
    {
        name: "Diya",
        review: "The vegetables were fresh and nicely packed."
    },
    {
        name: "Rahul",
        review: "Amazing discounts and smooth experience."
    },
    {
        name: "Sneha",
        review: "Loved the dairy products quality."
    }
];

defaultReviews.forEach((item) => {

    const commentCard = document.createElement("div");
    commentCard.classList.add("comment_card");

    const userName = document.createElement("h3");
    userName.textContent = item.name;

    const userComment = document.createElement("p");
    userComment.textContent = item.review;

    commentCard.appendChild(userName);
    commentCard.appendChild(userComment);

    commentsContainer.appendChild(commentCard);

});

// BUTTON FUNCTIONALITY

commentButton.addEventListener("click", () => {

    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if(name === "" || comment === ""){
        alert("Please fill all fields");
        return;
    }

    const commentCard = document.createElement("div");
    commentCard.classList.add("comment_card");

    const userName = document.createElement("h3");
    userName.textContent = name;

    const userComment = document.createElement("p");
    userComment.textContent = comment;

    // DELETE BUTTON

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete_btn");

    deleteBtn.addEventListener("click", () => {
        commentCard.remove();
    });

    commentCard.appendChild(userName);
    commentCard.appendChild(userComment);
    commentCard.appendChild(deleteBtn);

    commentsContainer.prepend(commentCard);

    // CLEAR INPUTS

    nameInput.value = "";
    commentInput.value = "";
});

document.body.appendChild(commentsSection);



const footer = document.createElement("div");
footer.classList.add("footer");

const appBanner = document.createElement("img");
appBanner.src = "image/App_download_banner.avif";

const footerLogo = document.createElement("img");
footerLogo.src = "image/Instamart_Logo.png";
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




document.body.appendChild(signInModal);




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


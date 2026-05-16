let categories = ["all", "ice-coffee", "hot-coffee", "Americano", "Espresso"];

let products = [
  {
    id: 1,
    name: "Ice latte",
    price: 22,
    categories: "ice-coffee",
    img: "../img/iced-latte-glass-pink-stand-wooden-table-summer-cafe-green-bushes 1.jpg",
  },
  {
    id: 2,
    name: "Latte",
    categories: "hot-coffee",
    price: 45,
    img: "../img/cold-coffee-drink 1.jpg",
  },
  {
    id: 3,
    name: "Ice Americano",
    price: 15,
    categories: "ice-coffee",
    img: "../img/cold-coffee-drink 1.jpg",
  },
  {
    id: 4,
    name: "Americano",
    price: 20,
    categories: "Americano",
    img: "../img/cold-coffee-drink 1.jpg",
  },
  {
    id: 5,
    name: "Espresso 30/70",
    price: 9,
    categories: "Espresso",
    img: "../img/cold-coffee-drink 1.jpg",
  },
  {
    id: 6,
    name: "Capuccino",
    categories: "hot-coffee",
    price: 25,
    img: "../img/cold-coffee-drink 1.jpg",
  },
  {
    id: 7,
    name: "Afogato",
    categories: "ice-coffee",
    price: 15,
    img: "../img/cold-coffee-drink 1.jpg",
  },
];
const productsPerPage = 6;
let currentPage = 1;
let currentProducts = products;

const paginationWrp = document.querySelector(".pagination");

const categoryWrp = document.querySelector(".category-wrp");
const productWrp = document.querySelector(".product-wrp");

categories.forEach((category) => {
  const categoryItem = document.createElement("div");
  categoryItem.classList.add("category-item");
  categoryItem.innerHTML = category;
  categoryWrp.appendChild(categoryItem);

  categoryItem.addEventListener("click", () => {
    const categoryItems = document.querySelectorAll(".category-item");
    categoryItems.forEach((item) =>
      item.classList.remove("category-item--active"),
    );
    categoryItem.classList.add("category-item--active");
    if (category === "all") {
      renderProducts(products);
    } else {
      const filteredProducts = products.filter(
        (product) => product.categories === category,
      );
      renderProducts(filteredProducts);
    }
  });
  if (
    category === "all" &&
    !categoryItem.classList.contains("category-item--active")
  ) {
    categoryItem.classList.add("category-item--active");
    renderProducts(products);
  }
});

function renderProducts(list) {
  productWrp.innerHTML = "";

  currentProducts = list;

  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;

  const paginatedProducts = list.slice(start, end);

  paginatedProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-cart");

    productCard.innerHTML = `
      <img class="product-cart__img" src="${product.img}" alt="${product.name}" />
      <span class="product-cart__name">${product.name}</span>
      <span class="product-cart__price">${product.price}</span>
    `;

    productWrp.appendChild(productCard);
  });

  renderPagination();
}
function renderPagination() {
  paginationWrp.innerHTML = "";

  const pageCount = Math.ceil(currentProducts.length / productsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");

    btn.innerText = i;

    btn.className =
      "px-4 py-2 rounded-lg border border-gray-300 hover:bg-primary hover:text-white transition";

    if (i === currentPage) {
      btn.classList.add("bg-primary", "text-white");
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      renderProducts(currentProducts);
    });

    paginationWrp.appendChild(btn);
  }
}

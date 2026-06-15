const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Food = require("../models/foodmodel");

// connect DB
connectDB();

const food = [
     {
    id: 5,
    name: "Burger Town",
    cuisines: ["Fast Food"],
    location: "Faridabad",
    address: "Sector 15",
    priceForTwo: 500,
    diningRating: 3.8,
    deliveryRating: 4.1,
    distance: "1.5 km",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/5be/633c07b60ae311a788b8ecf9b0a085be.jpeg?output-format=webp",
      "https://b.zmtcdn.com/data/dish_photos/4be/7fd06f6bddb22e8433745517ef17b4be.jpeg"
    ]
  }, {
    id: 7,
    name: "Cafe Coffee Day",
    cuisines: ["Cafe", "Beverages"],
    location: "Noida",
    address: "Mall Road",
    priceForTwo: 700,
    diningRating: 4.1,
    deliveryRating: 3.8,
    distance: "800 m",
    images: [
      "https://b.zmtcdn.com/data/pictures/3/8623/dd65c2ab279b916112002ec61b63d493_o2_featured_v2.jpg?output-format=webp",
      "https://b.zmtcdn.com/data/pictures/4/18611534/885a8c559e473747dede3f240d0a03cd_o2_featured_v2.jpg?output-format=webp"
    ]
  },
  {
    id: 1,
    name: "Ministry Of Beer",
    cuisines: ["Indian", "Chinese", "Japanese"],
    location: "Indirapuram, Ghaziabad",
    address: "Habitat Centre, Indirapuram",
    priceForTwo: 2000,
    diningRating: 4.5,
    deliveryRating: 4.0,
    distance: "300 m",
    images: [
      "https://b.zmtcdn.com/data/pictures/7/22028327/3f15aca216bdbfd66ad7a556f73e13b7_featured_v2.jpg?output-format=webp",
      "https://b.zmtcdn.com/data/pictures/chains/6/836/f3d8f3fc0f11c66886ef9b9fe2a86e8a_featured_v2.jpg?output-format=webp"
    ]
  },
  {
    id: 2,
    name: "Spice Garden",
    cuisines: ["North Indian", "Mughlai"],
    location: "Noida Sector 62",
    address: "Sector 62 Market",
    priceForTwo: 1200,
    diningRating: 4.2,
    deliveryRating: 3.9,
    distance: "1.2 km",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/703/4b8cd5c379669c27a25db039b60b3703.jpg?output-format=webp",
      "https://b.zmtcdn.com/data/dish_photos/8c3/b26737d846df3c1d30e68dd2fb3758c3.jpeg"
    ]
  },
  {
    id: 3,
    name: "Pizza Hub",
    cuisines: ["Italian", "Fast Food"],
    location: "Delhi",
    address: "Connaught Place",
    priceForTwo: 800,
    diningRating: 4.0,
    deliveryRating: 4.3,
    distance: "2 km",
    images: [
      "https://b.zmtcdn.com/data/pictures/1/22127501/b357744b2380f95c0cd4ae2d6566dd9e_o2_featured_v2.jpg",
      "https://b.zmtcdn.com/data/pictures/8/21476708/4d4367632cba956a0038e263ea37c049_o2_featured_v2.jpg"
    ]
  },
  {
    id: 4,
    name: "Sushi World",
    cuisines: ["Japanese"],
    location: "Gurgaon",
    address: "Cyber Hub",
    priceForTwo: 2500,
    diningRating: 4.6,
    deliveryRating: 4.2,
    distance: "4 km",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/204/f65d9606998bcb28d0374859f0e2a204.jpeg?output-format=webp",
      "https://b.zmtcdn.com/data/dish_photos/668/6c3d92941977abee7aaf88cea7b88668.jpeg"
    ]
  },
  {
    id: 5,
    name: "Burger Town",
    cuisines: ["Fast Food"],
    location: "Faridabad",
    address: "Sector 15",
    priceForTwo: 500,
    diningRating: 3.8,
    deliveryRating: 4.1,
    distance: "1.5 km",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/5be/633c07b60ae311a788b8ecf9b0a085be.jpeg?output-format=webp",
      "https://b.zmtcdn.com/data/dish_photos/4be/7fd06f6bddb22e8433745517ef17b4be.jpeg"
    ]
  },
  {
    id: 6,
    name: "Royal Biryani",
    cuisines: ["Hyderabadi", "Mughlai"],
    location: "Delhi",
    address: "Karol Bagh",
    priceForTwo: 900,
    diningRating: 4.3,
    deliveryRating: 4.4,
    distance: "2.3 km",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/2e6/5e5ef40b88e6466d0ea80e79aed182e6.jpeg?output-format=webp",
      "https://b.zmtcdn.com/data/pictures/0/19635330/7f0c007cd869bd7c867a07cd4a6578f9_o2_featured_v2.jpg?output-format=webp"
    ]
  },
  {
    id: 7,
    name: "Cafe Coffee Day",
    cuisines: ["Cafe", "Beverages"],
    location: "Noida",
    address: "Mall Road",
    priceForTwo: 700,
    diningRating: 4.1,
    deliveryRating: 3.8,
    distance: "800 m",
    images: [
      "https://b.zmtcdn.com/data/pictures/3/8623/dd65c2ab279b916112002ec61b63d493_o2_featured_v2.jpg?output-format=webp",
      "https://b.zmtcdn.com/data/pictures/4/18611534/885a8c559e473747dede3f240d0a03cd_o2_featured_v2.jpg?output-format=webp"
    ]
  },
  {
    id: 8,
    name: "Green Bowl",
    cuisines: ["Healthy", "Salads"],
    location: "Gurgaon",
    address: "Sector 29",
    priceForTwo: 1100,
    diningRating: 4.4,
    deliveryRating: 4.0,
    distance: "1 km",
    images: [
      "https://b.zmtcdn.com/data/pictures/chains/3/21672503/1736937201d3d774b9-658a-4b7a-9343-efe82154f6ce.jpg?output-format=webp&fit=around|771.75:416.25&crop=771.75:416.25;*,*",
      "https://b.zmtcdn.com/data/pictures/0/19444150/22558a91db4723f6d2832c43b13ac4c3_o2_featured_v2.jpg?output-format=webp"
    ]
  },
  {
    id: 9,
    name: "Tandoor Nights",
    cuisines: ["North Indian"],
    location: "Delhi",
    address: "Lajpat Nagar",
    priceForTwo: 1500,
    diningRating: 4.5,
    deliveryRating: 4.2,
    distance: "2.8 km",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/05d/69f62332b271fb381768045fe0c7a05d.jpeg?output-format=webp",
      "https://b.zmtcdn.com/data/dish_photos/a70/4de046c19b00431989e3d7cc8e6eaa70.jpeg?output-format=webp"
    ]
  },
  {
    id: 10,
    name: "Pasta House",
    cuisines: ["Italian"],
    location: "Noida",
    address: "Sector 18",
    priceForTwo: 1300,
    diningRating: 4.2,
    deliveryRating: 4.1,
    distance: "1.1 km",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/fed/cb1c2575f73e7831bdb5b8fe866d8fed.jpg?output-format=webp",
      "https://b.zmtcdn.com/data/dish_photos/c15/03657d4bc3acf9191c9e2a3c56c1bc15.jpg"
    ]
  },

  // 👇 same pattern continue (20 total)

  {
    id: 11,
    name: "Street Bites",
    cuisines: ["Street Food"],
    location: "Delhi",
    address: "Chandni Chowk",
    priceForTwo: 300,
    diningRating: 4.0,
    deliveryRating: 3.7,
    distance: "3 km",
    images: [
      "https://b.zmtcdn.com/data/pictures/9/21568329/5e32e61a72b9353eab8f447dc228883f_o2_featured_v2.jpg?output-format=webp",
      "https://b.zmtcdn.com/data/dish_photos/0d8/d7ab5f4e7e8abf7adfd15337e759f0d8.jpeg"
    ]
  },
  {
    id: 12,
    name: "BBQ Nation",
    cuisines: ["BBQ", "Grill"],
    location: "Noida",
    address: "DLF Mall",
    priceForTwo: 2200,
    diningRating: 4.6,
    deliveryRating: 4.3,
    distance: "2 km",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/f67/4eaa60b165551203f740ab090113bf67.jpeg?fit=around|130:130&crop=130:130;*,*",
      "https://b.zmtcdn.com/data/dish_photos/145/c6a2911a9aef86856c4546a29fd29145.jpeg?fit=around|130:130&crop=130:130;*,*"
    ]
  },
  {
    id: 13,
    name: "Sweet Tooth",
    cuisines: ["Desserts"],
    location: "Gurgaon",
    address: "Sector 56",
    priceForTwo: 600,
    diningRating: 4.3,
    deliveryRating: 4.5,
    distance: "900 m",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/2f2/27b56dd56aed15b3b43cf036ef24a2f2.jpg",
      "https://b.zmtcdn.com/data/pictures/8/18639118/b2fd80c9ff1cfde6e1e524357d40ac69_o2_featured_v2.jpg"
    ]
  },
  {
    id: 14,
    name: "Dosa Plaza",
    cuisines: ["South Indian"],
    location: "Delhi",
    address: "Janakpuri",
    priceForTwo: 700,
    diningRating: 4.1,
    deliveryRating: 4.0,
    distance: "1.7 km",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/6d9/1d971843fb0c372afedefe095085b6d9.jpg?output-format=webp",
      "https://b.zmtcdn.com/data/pictures/6/1426/56ef4ad75606531b05f9019a16404c56.jpg?output-format=webp"
    ]
  },
  {
    id: 15,
    name: "Wok Express",
    cuisines: ["Chinese"],
    location: "Noida",
    address: "Sector 76",
    priceForTwo: 900,
    diningRating: 4.2,
    deliveryRating: 4.3,
    distance: "1.4 km",
    images: [
      "https://b.zmtcdn.com/data/pictures/chains/9/22539269/1770880345b5e25c8e-da60-49d8-b213-97329969b074.png?output-format=webp&fit=around|771.75:416.25&crop=771.75:416.25;*,*",
      "https://b.zmtcdn.com/data/dish_photos/7a9/b323aefbe720e0b3f205571a65a947a9.jpg"
    ]
  },
  {
    id: 16,
    name: "Juice Junction",
    cuisines: ["Beverages"],
    location: "Gurgaon",
    address: "Cyber City",
    priceForTwo: 400,
    diningRating: 3.9,
    deliveryRating: 4.1,
    distance: "600 m",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/2e4/8b9447e7b2d518b67e5beae68223b2e4.jpg?output-format=webp",
      "https://b.zmtcdn.com/data/dish_photos/0d4/318f6261ed919ac0528c74c36b6230d4.jpeg?output-format=webp"
    ]
  },
  {
    id: 17,
    name: "Punjabi Dhaba",
    cuisines: ["Punjabi"],
    location: "Delhi",
    address: "GT Road",
    priceForTwo: 800,
    diningRating: 4.0,
    deliveryRating: 4.2,
    distance: "2.5 km",
    images: [
      "https://b.zmtcdn.com/data/pictures/6/21866366/b07f03b3f6a9ad5a537a6d9050c9f40f_o2_featured_v2.jpg",
      "https://b.zmtcdn.com/data/pictures/6/18562296/a3140eb806b33db7553d27a1384852c5_o2_featured_v2.jpg"
    ]
  },
  {
    id: 18,
    name: "Roll Factory",
    cuisines: ["Fast Food"],
    location: "Noida",
    address: "Sector 50",
    priceForTwo: 500,
    diningRating: 3.8,
    deliveryRating: 4.0,
    distance: "1 km",
    images: [
      "https://b.zmtcdn.com/data/pictures/2/22539072/03a4ce2cc39d5af8b68842c12c1b786e_o2_featured_v2.jpg?output-format=webp",
      "https://b.zmtcdn.com/data/dish_photos/5f4/267f107480af23835e2617bdc18a65f4.jpeg?output-format=webp"
    ]
  },
  {
    id: 19,
    name: "Ocean Delight",
    cuisines: ["Seafood"],
    location: "Gurgaon",
    address: "DLF Phase 3",
    priceForTwo: 1800,
    diningRating: 4.4,
    deliveryRating: 4.1,
    distance: "3.2 km",
    images: [
      "https://b.zmtcdn.com/data/pictures/7/20905267/1e2b1744b8c5385e15ce77efc100718a_o2_featured_v2.jpg?output-format=webp",
      "https://b.zmtcdn.com/data/dish_photos/2e6/5e5ef40b88e6466d0ea80e79aed182e6.jpeg?output-format=webp"
    ]
  },
  {
    id: 20,
    name: "The Pancake Story",
    cuisines: ["Desserts", "Cafe"],
    location: "Delhi",
    address: "Rajouri Garden",
    priceForTwo: 900,
    diningRating: 4.5,
    deliveryRating: 4.3,
    distance: "1.3 km",
    images: [
      "https://b.zmtcdn.com/data/dish_photos/96c/ca12af4b636fadade2703983a9f7396c.jpeg?output-format=webp",
      "https://b.zmtcdn.com/data/dish_photos/300/55eea1faa250fae6a2060352c0a62300.jpg"
    ]
  }
];

const insertData = async () => {
  try {
    await Food.deleteMany(); // old data remove (optional)
    await Food.insertMany(food); // data insert
    console.log("Dummy data inserted ");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

insertData();
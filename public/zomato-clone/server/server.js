const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");
const rateLimit = require("express-rate-limit");


app.set("views", path.join(__dirname, "../views")); // views folder path
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.set("view engine", "ejs");

// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});


// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
// DB connect
connectDB();

// routes import
const foodRoutes = require("./routes/foodRoutes");

// API
app.use("/api/food", foodRoutes);

// FIXED ROOT ROUTE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(3000, () => console.log("Server running on port 3000"));
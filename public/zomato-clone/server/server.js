const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

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
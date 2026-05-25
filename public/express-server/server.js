const express = require("express");
const dotenv = require("dotenv");

const apiRoutes = require("./routes/apiRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json());
app.use(loggerMiddleware);

/*
|--------------------------------------------------------------------------
| Root Route
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Express Server API is running successfully"
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api", apiRoutes);

/*
|--------------------------------------------------------------------------
| 404 Route Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Requested route not found"
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Middleware
|--------------------------------------------------------------------------
*/

app.use(errorMiddleware);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});

const express = require("express");
const path    = require("path");
const dotenv  = require("dotenv");

const apiRoutes        = require("./routes/apiRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const errorMiddleware  = require("./middleware/errorMiddleware");

dotenv.config();

const app  = express();
const PORT = process.env.PORT;
if (!PORT) {
  console.error("\x1b[31m[ERROR] PORT is not defined in .env\x1b[0m");
  process.exit(1);
}

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

/*
|--------------------------------------------------------------------------
| Static Files (Frontend Dashboard)
|--------------------------------------------------------------------------
*/
app.use(express.static(path.join(__dirname, "public")));

/*
|--------------------------------------------------------------------------
| Root Route — serves dashboard
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: `${process.env.APP_NAME || "Express Server"} API is running`,
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.use("/api", apiRoutes);

/*
|--------------------------------------------------------------------------
| 404 — Serves beautiful HTML 404 page for browser, JSON for API
|--------------------------------------------------------------------------
*/
app.use((req, res) => {
  const wantsJSON =
    req.headers.accept?.includes("application/json") ||
    req.originalUrl.startsWith("/api");

  if (wantsJSON) {
    return res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      timestamp: new Date().toISOString()
    });
  }

  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
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
  console.log("\x1b[32m");
  console.log("  ╔═══════════════════════════════════╗");
  console.log("  ║       Express Server Running       ║");
  console.log("  ╠═══════════════════════════════════╣");
  console.log(`  ║  Local:  http://localhost:${PORT}      ║`);
  console.log(`  ║  Env:    ${(process.env.NODE_ENV).padEnd(25)}║`);
  console.log("  ╚═══════════════════════════════════╝");
  console.log("\x1b[0m");
});
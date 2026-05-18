const express = require("express");
const cors = require("cors");

const notesRoutes = require("./routes/notesRoutes");
const app = express();
const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler);
app.use(express.json());
app.use(cors());

app.use("/api/notes", notesRoutes);

module.exports = app;
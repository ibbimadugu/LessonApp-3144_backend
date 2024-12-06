require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("./middleware/logger");
const path = require("path");

dotenv.config();
const app = express();

// Serve static files from the 'images' folder
app.use("/images", express.static(path.join(__dirname, "images")));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(logger);

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Routes
app.use("/lessons", require("./routes/lessons"));
app.use("/orders", require("./routes/orders"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

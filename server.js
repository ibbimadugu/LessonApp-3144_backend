require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("./middleware/logger");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(logger);

// Serve static files
app.use("/images", express.static(path.resolve(__dirname, "images")));

// MongoDB Connection
const client = new MongoClient(process.env.MONGO_URI);

let lessonsCollection;
let ordersCollection;

client.connect().then(() => {
  console.log("Connected to MongoDB");
  const db = client.db("LessonApp-3144");
  lessonsCollection = db.collection("lessons");
  ordersCollection = db.collection("orders");
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Lessons Routes
const lessonsRouter = require("./routes/lessons");
app.use(
  "/lessons",
  (req, res, next) => {
    req.lessonsCollection = lessonsCollection;
    next();
  },
  lessonsRouter
);

// Orders Routes
const ordersRouter = require("./routes/orders");
app.use(
  "/orders",
  (req, res, next) => {
    req.ordersCollection = ordersCollection;
    next();
  },
  ordersRouter
);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

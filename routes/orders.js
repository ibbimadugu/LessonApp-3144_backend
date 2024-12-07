const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const Order = require("../models/order");

// POST: Create a new order
router.post("/", async (req, res) => {
  try {
    const { name, phone, lessonIDs, spaces } = req.body;
    if (!name || !phone || !lessonIDs || !spaces) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const invalidLessonIDs = lessonIDs.filter((id) => !ObjectId.isValid(id));
    if (invalidLessonIDs.length > 0) {
      return res.status(400).json({
        error: `Invalid lesson ID(s): ${invalidLessonIDs.join(", ")}`,
      });
    }

    // Create a new order using the Order model (Mongoose)
    const newOrder = new Order({
      name,
      phone,
      lessonIDs,
      spaces,
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to create order", details: err.message });
  }
});

// GET: Retrieve all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to retrieve orders", details: err.message });
  }
});

// GET: Retrieve a specific order by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    console.error("Error retrieving order:", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve order", details: err.message });
  }
});

// PUT: Update an existing order
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, lessonIDs, spaces } = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    if (!name || !phone || !lessonIDs || !spaces) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const invalidLessonIDs = lessonIDs.filter((id) => !ObjectId.isValid(id));
    if (invalidLessonIDs.length > 0) {
      return res.status(400).json({
        error: `Invalid lesson ID(s): ${invalidLessonIDs.join(", ")}`,
      });
    }

    // Update the order in the database using Mongoose's findByIdAndUpdate method
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { name, phone, lessonIDs, spaces },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Return the updated order
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to update order", details: err.message });
  }
});

module.exports = router;

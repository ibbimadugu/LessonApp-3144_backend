// routes/orders.js
const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

// POST: Create a new order
router.post("/", async (req, res) => {
  try {
    const { name, phone, lessonIDs, spaces } = req.body;

    // Validate required fields
    if (!name || !phone || !lessonIDs || !spaces) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate lesson IDs
    const invalidLessonIDs = lessonIDs.filter((id) => !ObjectId.isValid(id));
    if (invalidLessonIDs.length > 0) {
      return res.status(400).json({
        error: `Invalid lesson ID(s): ${invalidLessonIDs.join(", ")}`,
      });
    }

    // Prepare the new order
    const newOrder = {
      name,
      phone,
      lessonIDs: lessonIDs.map((id) => ObjectId(id)),
      spaces,
    };

    // Insert the new order into the database
    const result = await req.ordersCollection.insertOne(newOrder);
    const savedOrder = await req.ordersCollection.findOne({
      _id: result.insertedId,
    });

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res
      .status(500)
      .json({ error: "Failed to create order", details: err.message });
  }
});

// GET: Retrieve all orders
router.get("/", async (req, res) => {
  try {
    const orders = await req.ordersCollection.find().toArray();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error retrieving orders:", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve orders", details: err.message });
  }
});

// GET: Retrieve a specific order by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await req.ordersCollection.findOne({ _id: ObjectId(id) });
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

    // Validate required fields
    if (!name || !phone || !lessonIDs || !spaces) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate lesson IDs
    const invalidLessonIDs = lessonIDs.filter((id) => !ObjectId.isValid(id));
    if (invalidLessonIDs.length > 0) {
      return res.status(400).json({
        error: `Invalid lesson ID(s): ${invalidLessonIDs.join(", ")}`,
      });
    }

    // Prepare the update data
    const updatedOrder = {
      name,
      phone,
      lessonIDs: lessonIDs.map((id) => ObjectId(id)),
      spaces,
    };

    const result = await req.ordersCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: updatedOrder }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const updatedOrderData = await req.ordersCollection.findOne({
      _id: ObjectId(id),
    });
    res.status(200).json(updatedOrderData);
  } catch (err) {
    console.error("Error updating order:", err);
    res
      .status(500)
      .json({ error: "Failed to update order", details: err.message });
  }
});

module.exports = router;

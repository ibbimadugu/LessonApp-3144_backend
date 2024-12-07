const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

// POST - Create an Order
router.post("/", async (req, res) => {
  try {
    const { name, phone, lessonIDs, spaces } = req.body;

    // Validate required fields
    if (
      !name ||
      !phone ||
      !Array.isArray(lessonIDs) ||
      lessonIDs.length === 0 ||
      !spaces
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert lessonIDs to ObjectId format
    const lessonObjectIds = lessonIDs.map((id) => new ObjectId(id));

    // Create the order object
    const order = {
      name,
      phone,
      lessonIDs: lessonObjectIds,
      spaces,
      createdAt: new Date(),
    };

    // Insert the order into MongoDB
    const result = await req.ordersCollection.insertOne(order);

    // Send the created order with the insertedId
    if (result.acknowledged) {
      res.status(201).json({ ...order, _id: result.insertedId });
    } else {
      res.status(500).json({ error: "Failed to create order" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create order",
      details: err.message,
    });
  }
});

// GET - Get all Orders
router.get("/", async (req, res) => {
  try {
    const orders = await req.ordersCollection.find().toArray();
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .send({ error: "Failed to retrieve orders", details: err.message });
  }
});

module.exports = router;

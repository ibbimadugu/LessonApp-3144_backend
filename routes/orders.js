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

// PUT - Update an Order
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, lessonIDs, spaces } = req.body;

    // Validate order ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    // Validate fields (optional update, so no fields are strictly required)
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (lessonIDs) {
      if (!Array.isArray(lessonIDs)) {
        return res
          .status(400)
          .json({ error: "lessonIDs must be an array of IDs" });
      }
      updateFields.lessonIDs = lessonIDs.map((id) => new ObjectId(id));
    }
    if (spaces) updateFields.spaces = spaces;

    // Update the order in MongoDB
    const result = await req.ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount > 0) {
      res.status(200).json({ message: "Order updated successfully" });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to update order",
      details: err.message,
    });
  }
});

module.exports = router;

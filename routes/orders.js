const express = require("express");
const Order = require("../models/order");
const router = express.Router();

// POST
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

// GET all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await req.lessonsCollection.find().toArray();
    res.json(lessons);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT update a lesson
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { space } = req.body;

    const result = await req.lessonsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { spaces: space } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send("Lesson not found");
    }

    res.json({ message: "Lesson updated successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET search lessons
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const lessons = await req.lessonsCollection
      .find({
        $or: [
          { subject: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
          { price: { $regex: query, $options: "i" } },
        ],
      })
      .toArray();

    res.json(lessons);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

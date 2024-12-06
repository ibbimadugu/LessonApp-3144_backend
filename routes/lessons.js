const express = require("express");
const Lesson = require("../models/lesson");
const router = express.Router();

// GET
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const { space } = req.body;
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { space },
      { new: true }
    );
    res.json(updatedLesson);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET (Search lessons)
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const lessons = await Lesson.find({
      $or: [
        { topic: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { price: { $regex: query, $options: "i" } },
        { space: { $regex: query, $options: "i" } },
      ],
    });
    res.json(lessons);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

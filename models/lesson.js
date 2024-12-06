const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  space: { type: Number, required: true },
});

module.exports = mongoose.model("Lesson", lessonSchema);

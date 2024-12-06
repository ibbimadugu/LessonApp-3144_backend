// models/lesson.js
const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: String, required: true },
  spaces: { type: Number, required: true },
  image: { type: String, required: true },
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;

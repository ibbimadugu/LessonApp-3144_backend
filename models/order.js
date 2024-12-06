const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  lessonIDs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Lesson",
    required: true,
  },
  spaces: { type: Number, required: true },
});

module.exports = mongoose.model("Order", orderSchema);

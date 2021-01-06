const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  name: { type: String },
  mobile: { type: String, required: true },
  email: { type: String },
  city: { type: String },
  state: { type: String },
  tags: [],
  fields: [Object],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Contact", contactSchema);

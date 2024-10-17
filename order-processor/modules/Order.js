const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  item: String,
  xl: String,
  quantity: Number,
  price: Number,
});

module.exports = mongoose.model("Order", orderSchema);

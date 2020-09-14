const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  priceAfterDiscount: Number,
  image: String,
  discount: Number,
  addedDate: String,
  // Other Fields
  categorys: String,
  _categorys: Array,
  seq: Number
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
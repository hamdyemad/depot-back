const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  seq: Number,
  // English
  name: String,
  description: String,
  category: String,
  // English
  // Arabic
  nameAr: String,
  descriptionAr: String,
  categoryAr: String,
  // Arabic
  price: Number,
  priceAfterDiscount: Number,
  image: String,
  discount: Number,
  // Other Fields
  static: String,
  _categorys: Array,
  _categorysAr: Array,
  addedDate: {
    type: String,
    default: new Date().toDateString()
  }
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
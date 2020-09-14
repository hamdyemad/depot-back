const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  userId: String,
  productId: String,
  name: String,
  description: String,
  category: String,
  image: String,
  price: Number,
  priceAfterDiscount: Number,
  discount: Number,
  amount: Number,
});

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;

const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  userId: String,
  productId: String,
  //en
  name: String,
  description: String,
  category: String,
  //en
  //ar
  nameAr: String,
  descriptionAr: String,
  categoryAr: String,
  //ar
  image: String,
  price: Number,
  priceAfterDiscount: Number,
  discount: Number,
  amount: Number,
});

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;

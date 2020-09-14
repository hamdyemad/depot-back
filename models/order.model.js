const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  userId: String,
  orders: Array,
  clientName: String,
  address: String,
  mobile: String,
  city: String,
  status: String,
  notifiedCustomer: Boolean,
  dateAdded: String,
  comment: String,
  orderHistory: Array,
  seq: Number
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;



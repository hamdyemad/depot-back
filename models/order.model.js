const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  userId: String,
  seq: Number,
  orders: Array,
  clientName: String,
  address: String,
  mobile: String,
  city: String,
  comment: String,
  status: {
    type: String,
    default: "pending"
  },
  notifiedCustomer: {
    type: Boolean,
    default: false
  },
  orderHistory: {
    type: Array,
    default: []
  },
  dateAdded: {
    type: String,
    defualt: new Date().toDateString()
  }
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;



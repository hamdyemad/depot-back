const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  role: {
    type: String,
    required: true,
    default: "user"
  },
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  addedDate: {
    type: Date,
    required: true
  },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
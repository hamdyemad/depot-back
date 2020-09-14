const express = require("express");
const app = express();
require('dotenv').config();
const bodyParser = require("body-parser");
const path = require("path");

const productRoute = require("./routes/products.route");
const usersRoute = require("./routes/users.route");
const cartRoute = require("./routes/carts.route");
const orderRoute = require("./routes/orders.route");
const mongoose = require('mongoose');
const DB_OPTION = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

// DB_URL=mongodb+srv://hamdy:hamdy@commerce.eyedx.mongodb.net/depot?retryWrites=true&w=majority
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

mongoose.connect(process.env.DB_URL, DB_OPTION).then(() => {
  console.log('connected to mongo database')
})
  .catch((err) => {
    console.log(err)
  })

// Statics
app.use(express.static(path.join(__dirname, "images")));

//routes
app.use("/products", productRoute);
app.use(usersRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

// server
app.listen(3000, console.log("server listend at 3000"));

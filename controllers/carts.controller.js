const Cart = require('../models/cart.model');
/* get all cart*/
exports.getAllCarts = (req, res) => {
  Cart.find({ userId: req.userId }).then((doc) => {
    res.json(doc);
  });
};

/* add new cart */
exports.addNewCart = (req, res) => {
  let body = req.body;
  Cart.findOne({ productId: body.productId }).then((doc) => {
    if (doc) {
      Cart.updateOne({
        amount: body.amount,
      }).then((value) => {
        res.json(value);
      });
    } else {
      let cart = new Cart({
        userId: req.userId,
        productId: body.productId,
        name: body.name,
        description: body.description,
        category: body.category,
        image: body.image,
        price: body.price,
        priceAfterDiscount: body.priceAfterDiscount,
        discount: body.discount,
        amount: body.amount
      });
      cart.save().then((doc) => {
        res.json(doc);
      });
    }
  });
};

/* update cart by id */
exports.updateCart = (req, res) => {
  Cart.findByIdAndUpdate(req.params.cartId, { amount: req.body.amount }).then((value) => {
    res.json(value);
  });
};

/* delte all carts */
exports.deleteAllCarts = (req, res) => {
  Cart.deleteMany({ userId: req.userId }).then((value) => {
    res.json(value);
  });
};

/* delete cart */
exports.deleteCart = (req, res) => {
  Cart.findByIdAndDelete(req.params.cartId).then((value) => {
    res.json(value);
  });
};

const Order = require('../models/order.model');

/* POST Add new order but before we add the order we increament the sequence value and pass the end value to the newest order */
exports.addOrder = (req, res) => {

  Order.findOneAndUpdate({ _static: 'static' }, { $inc: { seq: 1 } }).then((value) => {
    let seq = value.seq;
    let newOrder = new Order({
      userId: req.userId,
      seq: seq,
      orders: req.body.orders,
      clientName: req.body.clientInfo.clientName,
      address: req.body.clientInfo.address,
      mobile: `0${req.body.clientInfo.mobile}`,
      city: req.body.clientInfo.city,
      comment: req.body.clientInfo.comment,
      dateAdded: new Date().toDateString()
    });
    newOrder
      .save()
      .then((doc) => {
        res.json(doc);
      })
  })
};

/* GET get all orders  */
exports.getAllOrders = (req, res) => {
  let query = req.query;
  if (
    req.query.id ||
    req.query.status ||
    req.query.city ||
    req.query.name ||
    req.query.dateAdded
  ) {
    Order.find({
      $or: [
        { seq: query.id },
        { clientName: query.name },
        { city: query.city },
        { status: query.status },
        { dateAdded: query.dateAdded },
      ],
      $nor: [{ _static: 'static' }]
    }).sort({ seq: -1, dateAdded: -1 })
      .then((doc) => {
        res.json(doc);
      })
  } else {
    Order.find({ $nor: [{ _static: 'static' }] }).sort({ seq: -1, dateAdded: -1 })
      .then((value) => {
        res.json(value);
      })
  }
};

/* GET get order by id */
exports.getOrderById = (req, res) => {
  Order.findById(req.params.id).then((doc) => {
    res.json(doc);
  })
}

exports.getOrders = (req, res) => {
  Order.find({ userId: req.userId }).then((doc) => {
    console.log(doc)
    res.json(doc);
  })
}

/* DELETE delete order by id */
exports.deleteOrderById = (req, res) => {
  Order.findByIdAndDelete(req.params.id).then((doc) => {
    res.json(doc);
  })
}

/* POST add order histroy */
exports.addOrderHistory = (req, res) => {
  let history = req.body;
  Order.findByIdAndUpdate(req.params.id,
    {
      $push: { orderHistory: history },
      status: history.status,
      comment: history.comment,
      notifiedCustomer: history.notifiedCustomer
    }).then((value) => {
      res.json(value);
    })
}
/* POST add array of history */
exports.addManyOfHistory = (req, res) => {
  let body = req.body;
  let history = req.body.history;
  console.log(body);
  Order.updateMany({ $or: body.seqs }, {
    $push: { orderHistory: history },
    status: history.status,
    notifiedCustomer: history.notifiedCustomer,
    dateModified: history.dateModified
  }).then((value) => {
    res.json(value);
  })
}

/* PATCH  Update the status of order byt pathing the body contains: an array: [{seq: num1}, {seq: num2}] like this */
exports.updateStatusOfSpecificOrders = (req, res) => {
  Order.updateMany({ $nor: [{ _static: 'static' }], $or: req.body.seqs }, { status: req.body.status }).then((doc) => {
    res.json(doc);
  })
}


/* GET get Invoices by passing the ids of orders i checked it's about array of id's like: ['aganhfoans', 'aaishfioas', etc..]; */

exports.getInvoices = (req, res) => {
  let ids = req.body;
  Order.find({ $nor: [{ _static: 'static' }], _id: { $in: ids } })
    .then((value) => {
      res.json(value);
    })
}

/* GET Get Order Inforamtion by pass the sequence of order */
exports.exportOrders = (req, res) => {
  Order.find({ $nor: [{ _static: 'static' }], $or: req.body.seqs }).then((doc) => {
    res.json(doc);
  })
}
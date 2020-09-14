const Product = require('../models/products.model');
const fs = require('fs');

// Delete Img fn
function deleteImg(img) {
  fs.unlink(`images/${img}`, (err) => {
    console.log('image has been removed');
    if (err) console.log(err, 'err');
  })
}

/* GET get all categorys */
exports.getAllCategorys = (req, res) => {
  Product.find({ categorys: 'categorys' }).then((doc) => {
    res.json(doc)
  });
}

/* GET products by options */
exports.getProducts = (req, res) => {
  function getQ(min, max) {
    if (min && max) {
      return { priceAfterDiscount: { $gte: min, $lte: max } }
    } else {
      return { priceAfterDiscount: { $gte: min } }
    }
  }
  let query = req.query;
  console.log(query)
  if (Object.keys(query).length == 0 || query.category == 'all') {
    /* GET get all products */
    Product.find({ $nor: [{ categorys: 'categorys' }] }).sort({ seq: -1, addedDate: -1 })
      .then((doc) => {
        res.json(doc)
      })
  } else {
    /* GET get products by query */
    Product.find({
      $nor: [{ categorys: 'categorys' }],
      $or: [
        { category: query.category },
        { seq: query.id },
        { name: query.name },
        { addedDate: query.addedDate },
        getQ(query.min, query.max)
      ],
    }).then((doc) => {
      res.json(doc)
    })
  }
};

/* GET product by id */
exports.getProductById = (req, res) => {
  let productId = req.params.id;
  Product.findById(productId).then((doc) => {
    res.json(doc);
  });
};

/* POST new product */
exports.addNewProduct = (req, res) => {
  req.body.image = req.file.filename;
  let body = req.body;
  Product.findOne({ name: body.name }).then((doc) => {
    if (doc) {
      res.json({ message: "there is product named like this" });
    } else {
      Product.findOneAndUpdate({ categorys: 'categorys' }, { $inc: { seq: 1 } }).then((value) => {
        let newProduct = new Product({
          seq: value.seq,
          name: body.name,
          description: body.description,
          category: body.category,
          price: body.price,
          priceAfterDiscount: (body.price - (body.price * body.discount / 100)),
          discount: body.discount,
          image: body.image,
          addedDate: new Date().toDateString()
        });
        newProduct
          .save()
          .then((doc) => {
            if (doc) {
              Product.findOneAndUpdate({ categorys: 'categorys' }, { $addToSet: { _categorys: [body.category] } }).then((cat) => {
                res.json(doc);
              })
            }
          })
      })
    }
  });
  // productModel.AddNewProducts(req.body).then((value) => {
  //   res.json(value);
  // })
}

/* PATCH product */
exports.updateProduct = (req, res) => {
  let body = req.body;
  console.log(req.file);
  if (req.file) {
    body.image = req.file.filename;
  }
  body.priceAfterDiscount = body.price - (body.price * body.discount / 100);
  Product.findById(req.params.id).then(doc => {
    if (doc) {
      Product.updateOne(doc, body).then((value) => {
        console.log(value)
        if (req.file) {
          // Delete Previous Image
          deleteImg(doc.image);
        }
        res.json(value);
      })
    }
  })
};

/* DELETE product */
exports.deleteProduct = (req, res) => {
  Product.findByIdAndDelete(req.params.id).then((value) => {
    if (value) {
      console.log(value);
      // Delete Image
      deleteImg(value.image);
      res.json(value);
    }
    else {
      res.json({ message: "it's already deleted" });
    }
  })
};

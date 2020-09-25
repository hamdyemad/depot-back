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
  Product.find({ static: 'static' }).then((doc) => {
    res.json(doc)
  });
}

/* POST add new category */
exports.addNewCategory = (req, res) => {
  Product.findOneAndUpdate({ static: 'static' }, {
    $addToSet: {
      _categorys: req.body.newCategory,
      _categorysAr: req.body.newCategoryAr
    }
  }).then(doc => {
    res.json(doc);
  })
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
  if (Object.keys(query).length == 0 || query.category == 'all' || query.category == 'الكل') {
    /* GET get all products */
    Product.find({ $nor: [{ static: 'static' }] }).sort({ seq: -1, addedDate: -1 })
      .then((doc) => {
        res.json(doc)
      })
  } else {

    /* GET get products by query */
    Product.find({
      $nor: [{ static: 'static' }],
      $or: [
        { category: query.category },
        { categoryAr: query.category },
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

/*
  if (req.headers["accept-language"] == 'ar') {
    console.log('ar')
  } else {

  }
*/

/* POST new product */
exports.addNewProduct = (req, res) => {
  req.body.image = req.file.filename;
  let body = req.body;
  Product.findOne({ name: body.name, nameAr: body.nameAr }).then((doc) => {
    if (doc) {
      res.json({ enMessage: "there is product named like this" });
    } else {
      Product.findOneAndUpdate({ static: 'static' }, { $inc: { seq: 1 } }).then((value) => {
        let newProduct = new Product({
          seq: value.seq,
          //en
          name: body.name,
          description: body.description,
          category: body.category,
          //en
          //ar
          nameAr: body.nameAr,
          descriptionAr: body.descriptionAr,
          categoryAr: body.categoryAr,
          //ar
          price: body.price,
          priceAfterDiscount: (body.price - (body.price * body.discount / 100)),
          discount: body.discount,
          image: body.image
        });
        newProduct
          .save()
          .then((doc) => {
            if (doc) {
              Product.findOneAndUpdate(
                { static: 'static' }, { $addToSet: { _categorys: [body.category], _categorysAr: [body.categoryAr] } }).then((cat) => {
                  res.json(doc);
                })
            }
          })
      })
    }
  });

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

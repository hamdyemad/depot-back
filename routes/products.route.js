const router = require("express").Router();
const productsController = require("../controllers/products.controller");
const verfication = require('../verfication/authorization');
const multer = require('multer');

/* GET all products */
router.get("/", productsController.getProducts);

/* POST new product */
router.post("/", verfication.verifyedAdmin, multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
}).single('image'), productsController.addNewProduct);

/* GET get all categorys */
router.get('/categorys', productsController.getAllCategorys)

/* GET product by id */
router.get("/:id", productsController.getProductById);

/* PATCH product */
router.patch("/:id", verfication.verifyedAdmin, multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
}).single('image'), productsController.updateProduct);

/* DELETE product */
router.delete("/:id", verfication.verifyedAdmin, productsController.deleteProduct);

module.exports = router;

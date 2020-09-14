const router = require("express").Router();
const cartsController = require("../controllers/carts.controller");
const verfication = require("../verfication/authorization");
/* GET get all cart*/
router.get("/", verfication.verifyedUser, cartsController.getAllCarts);

/* POST cart add new cart */
router.post("/", verfication.verifyedUser, cartsController.addNewCart);

/* PATCH cart by id */
router.patch("/:cartId", verfication.verifyedUser, cartsController.updateCart);

/* DELETE all carts */
router.delete("/", verfication.verifyedUser, cartsController.deleteAllCarts);

/* DELETE cart by id */
router.delete("/:cartId", verfication.verifyedUser, cartsController.deleteCart);

module.exports = router;

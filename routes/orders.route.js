const router = require("express").Router();
const verfication = require("../verfication/authorization");
const ordersController = require("../controllers/orders.controller");

/* POST add order  */
router.post("/", verfication.verifyedUser, ordersController.addOrder);

/* GET get all orders && by query  */
router.get("/", verfication.verifyedAdmin, ordersController.getAllOrders);

/* GET get orders invoices */
router.post('/shipping', verfication.verifyedAdmin, ordersController.getInvoices)

/* GET get orders by seqs */
router.post('/export', verfication.verifyedAdmin, ordersController.exportOrders)

/* GET get orders by passing the userId */
router.get('/status', verfication.verifyedUser, ordersController.getOrders)

/* GET get order by id */
router.get('/:id', verfication.verifyedAdmin, ordersController.getOrderById);


/* DELETE delete order by id */
router.delete('/:id', verfication.verifyedAdmin, ordersController.deleteOrderById)

/* POST add order histroy */
router.post('/history/:id', verfication.verifyedAdmin, ordersController.addOrderHistory)

/* POST add array of order history */
router.post('/history', verfication.verifyedAdmin, ordersController.addManyOfHistory)

/* PATCH update all status */
router.patch('/', verfication.verifyedAdmin, ordersController.updateStatusOfSpecificOrders)


module.exports = router;

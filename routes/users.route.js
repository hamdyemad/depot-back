const router = require("express").Router();
const usersController = require("../controllers/users.controller");
const verfication = require('../verfication/authorization');

/* POST register */
router.post("/register", usersController.register);

/* POST login */
router.post("/login", usersController.login);

/* GET get user information */
router.get('/user', verfication.verifyedAdmin, usersController.getUserInfo);

/* POST add new admin */
router.post('/admins', verfication.verifyedAdmin, usersController.addAdmin)

/* GET all admins */
router.get("/admins", verfication.verifyedAdmin, usersController.getAllAdmins);

/* PATCH update admin role */
router.patch('/admins/:id', verfication.verifyedAdmin, usersController.updateAdminRole)

/* DELETE admin by ID */
router.delete("/admins/:id", verfication.verifyedAdmin, usersController.deleteAdmin);

module.exports = router;

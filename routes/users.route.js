const router = require("express").Router();
const usersController = require("../controllers/users.controller");

/* POST register */
router.post("/register", usersController.register);

/* POST login */
router.post("/login", usersController.login);

/* GET all Users */
router.get("/users", usersController.getAllUsers);

/* PATCH User */
router.patch("/users/:id", usersController.updateUser);

/* DELETE by ID */
router.delete("/users/:id", usersController.deleteUser);

module.exports = router;

const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users_controller");

router.get("/profile", usersController.profile);
router.get("/sign-up", usersController.signup);
router.get("/sign-in", usersController.signin);
router.post("/create", usersController.create);
// Route to manual authentication.
router.post("/create-session", usersController.createSession);
router.post("/sign-out", usersController.signout);

module.exports = router;
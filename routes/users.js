const express = require("express");
const router = express.Router();

const passport = require("passport");
const usersController = require("../controllers/users_controller");

router.get("/profile", usersController.profile);
router.get("/sign-up", usersController.signup);
router.get("/sign-in", usersController.signin);
router.post("/create", usersController.create);
// Using passport as a middleware to authenticate.
router.post("/create-session",passport.authenticate(
    "local", // local strategy
    { failureRedirect: "/users/sign-in" }
  ),
  usersController.createSession
);
// router.post("/sign-out", usersController.signout);

module.exports = router;

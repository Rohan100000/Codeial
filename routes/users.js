const express = require("express");
const passport = require("passport");
const router = express.Router();

const usersController = require("../controllers/users_controller");

router.get("/profile/:id",passport.checkAuthentication ,usersController.profile);
router.post("/update/:id",passport.checkAuthentication ,usersController.update);
router.get("/sign-up", usersController.signup);
router.get("/sign-in", usersController.signin);
router.post("/create", usersController.create);
// Using passport as a middleware to authenticate.
router.post("/create-session",passport.authenticate(
    "local", // local strategy
    { failureRedirect: '/users/sign-in' }
  ),
  usersController.createSession
);
router.get("/sign-out", usersController.destroySession);

module.exports = router;

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true
    },
    function (req,email, password, done) {// done is a callback function
      // find a user and establish the identity
      User.findOne({ email: email }, function (error, user) {
        if (error) {
          req.flash("error",error);
          return done(error);
        }

        if (!user || user.password != password) {
          req.flash("error","Invalid username/password");
          return done(null, false);
        }

        return done(null, user);
      });
    }
  )
);

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (error, user) {
    if (error) {
      console.log("error in finding user --> Passport");
      return done(error);
    }

    return done(null, user);
  });
});

// Check if the user is authenticated
passport.checkAuthentication = function (request, response, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (request.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return response.redirect("/users/sign-in");
};
passport.setAuthenticatedUser = function (request, response, next) {
  if (request.isAuthenticated()) {
    // req.user contains the current signed
    // in user from the session cookie and
    // we are just sending this to the locals
    // for the views
    response.locals.user = request.user;
  }
  next();
};

module.exports = passport;

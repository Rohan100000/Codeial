const User = require("../models/user");

module.exports.profile = function (request, response) {
  if (request.cookies.user_id) {
    User.findById(request.cookies.user_id, function (error, user) {
      if (user) {
        return response.render("user_profile", {
          title: "User Profile",
          user: user,
        });
      } else {
        return response.redirect("/users/sign-in");
      }
    });
  } else {
    return response.redirect("/users/sign-in");
  }
};

// render the sign up page
module.exports.signup = function (request, response) {
  response.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// render the sign in page
module.exports.signin = function (request, response) {
  return response.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

// get the sign up data.
module.exports.create = function (request, response) {
  // Incorrect password
  if (request.body.password != request.body.confirm_password) {
    return response.redirect("back");
  }

  // Find user
  User.findOne({ email: request.body.email }, function (error, user) {
    if (error) {
      console.log("error in finding user in signing up");
      return;
    }
    if (!user) {
      User.create(request.body, function (error, user) {
        if (error) {
          console.log("error in creating user while signing up");
          return;
        }
        return response.redirect("/users/sign-in");
      });
    } else {
      return response.redirect("back");
    }
  });
};

// sign in and create a session for the user.
module.exports.createSession = function (request, response) {
  // find the user
  User.findOne({ email: request.body.email }, function (error, user) {
    if (error) {
      console.log("error in finding user in signing up");
      return;
    }
    // handle user found
    if (user) {
      // handle password which doesn't match.
      if (user.password != request.body.password) {
        return response.redirect("back");
      }
      // handle session creation
      response.cookie("user_id", user.id);
      return response.redirect("/users/profile");
    } else {
      // handle user not found
      return response.redirect("back");
    }
  });
};

module.exports.signout = function (request,response) {
  // clearing the cookie for sign out
  if(request.cookies.user_id){
    response.clearCookie("user_id");
    return response.redirect("/users/sign-in");
  }
  else{
    return response.redirect('back');
  }
}
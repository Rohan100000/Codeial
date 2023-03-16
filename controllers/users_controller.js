/* **********************Passport.js Authentication************************ */

const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (error, user) {
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user
    });
  });
};

module.exports.update = async function(req,res){
  // if(req.user.id == req.params.id){
  //   User.findByIdAndUpdate(req.params.id,req.body,function(error,user){
  //     return res.redirect("back");
  //   })
  // }else{
  //   return res.status(401).send("Unauthorized");
  // }
  if(req.user.id == req.params.id){
    try{
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req,res,function(error){
        if(error){
          console.log("**** Multer error :",error);
        }else{
          user.name = req.body.name;
          user.email = req.body.email;
        }
        if(req.file){
          if(user.avatar){
            fs.unlinkSync(path.join(__dirname,"..",user.avatar));
          }
          // this is saving the path of an uploaded file into the avatar field of the user
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      })
    }catch(error){
      return res.redirect("back");
    }
  }else{
    return res.status(401).send("Unauthorized");
  }
}

// render the sign up page
module.exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// render the sign in page
module.exports.signin = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing up");
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating user while signing up");
          return;
        }

        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash("success","Logged in Successfully");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  // logout has been upgraded as an asynchronous function so it requires a callback function to handle error now
  req.logout(function (error) {
    if (error) {
      return next(error);
    }
    req.flash("success","You have logged out!");
    return res.redirect("/");
  });
};

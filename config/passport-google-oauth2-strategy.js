const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "1026427801708-qg207fqh2n75v17sargrb1rt6hdbihag.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
},function(accessToken, refreshToken,profile,done){
    User.findOne({email: profile.emails[0].value}).exec(function(error,user){
        if(error){
            console.log("error in google strategy passport: ",error);
            return;
        }
        console.log(accessToken,refreshToken);
        console.log(profile);
        if(user){
            // if found, set this user as req.user
            return done(null,user);
        }else{
            // if not found, create the user and set it as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString("hex"),
            }, function(error,user){
                if(error){
                    console.log("error in creating user google strategy passport: ",error);
                    return;
                }
                return done(null,user);
            })
        }
    })
}));

module.exports = passport;
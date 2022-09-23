const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
// Used for session cookie.
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;

// app.use(express);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./assets"));

app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// use express router.
app.use("/", require("./routes/index.js"));

// set up the view engine.
app.set("view engine", "ejs");
app.set("views", "./views");

// Using middleware to create the session usin passport.js
app.use(
  session({
    name: "codeial",
    // TODO change the secret before deployment in production mode
    secret: "blasomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.listen(port, function (error) {
  if (error) {
    // backticks used for interpolation. ${} decided on runtime.
    console.log(`Error: ${error}`);
  } else {
    console.log(`Server is running on port: ${port}`);
  }
});

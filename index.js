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
const passportConfig = require("./config/passport-local-strategy");
const passportLocal = require("passport-local").Strategy;
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo");
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

// setup the chat server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");

// using the sass middleware
app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",  
    prefix: "/css",
  })
);

// app.use(express);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./assets"));

// make the uploads path available to the browser
app.use("/uploads",express.static(__dirname + "/uploads"));

app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set up the view engine.
app.set("view engine", "ejs");
app.set("views", "./views");

// Using middleware to create the session using passport.js
// Mongo Store is used to store the session cookie in the db
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
    store: MongoStore.create({
      mongooseConnection: db,
      autoRemove: "disabled",
      // Added next line from stackoverflow to remove the (session) parameter from line 13
      mongoUrl: "mongodb://localhost/codeial_development",
    }),
    function(error) {
      console.log(error || "connect-mongodb setup okay");
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router.
app.use("/", require("./routes/index.js"));

app.listen(port, function (error) {
  if (error) {
    // backticks used for interpolation. ${} decided on runtime.
    console.log(`Error: ${error}`);
  } else {
    console.log(`Server is running on port: ${port}`);
  }
});

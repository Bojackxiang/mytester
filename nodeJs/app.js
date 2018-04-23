const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const User = require("./db_schema/model");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
// =====================================================================================================================
mongoose.connect("mongodb://localhost:27017/angulardb");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(cors());
// =====================================================================================================================
/**
 * test home page */
app.get("/", function(req, res) {
  res.send("test");
});

/**
 * log in request */
app.post("/api/login", (req, res) => {
  console.log(res.body);
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  User.findOne({ email: userEmail }, (err, obj) => {
    if (err) {
      // no such user
      res.json({
        success: false,
        message: "no such user"
      });
    } else {
      if (obj.password != userPassword) {
        // wrong password
        res.json({
          success: false,
          message: "wrong password"
        });
      } else {
        // log in success and send the token to the user
        var user = { email: userEmail, password: userPassword };
        var token = jwt.sign(user, "test", {
          expiresIn: 10 // expires in 24 hours
        });
        res.json({
          success: true,
          message: "Enjoy your token!",
          token: token
        });
      }
    }
  });
});

/**
 * save new user to database */
app.post("/api/register", (req, res) => {
  const email = req.body.email;
  const userpassword = req.body.password;
  newUser = new User({
    email: email,
    password: userpassword
  });
  User.findOne({ email: email }, (err, obj) => {
    if (obj) {
      res.json({
        success: false,
        message: "duplicated one"
      });
    } else {
      newUser.save();
      res.json({
        success: false,
        message: "successfully saved"
      });
    }
  });
});

/**
 * secret page */
app.get("/api/data", (req, res) => {
  User.find({}, (err, users) => {
    res.json(users);
  });
});

/**
 * run server*/
app.listen(3000, () => {
  console.log("server works");
});

const express = require("express");
const router = express.Router({ mergeParams: true });
const NewUser = require("../Models/user");
const ExpressErr = require("../utils/ExpressErr");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signup, login, logout } = require("../Controllers/users.js");

router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup.ejs");
  })
  .post(wrapAsync(signup));

router
  .route("/login")
  .get((req, res) => {
    res.render("users/login");
  })
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(login)
  );

router.get("/logout", logout);
module.exports = router;

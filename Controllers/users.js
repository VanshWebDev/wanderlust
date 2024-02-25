const NewUser = require("../Models/user");

const signup = async (req, res, next) => {
  try {
    let { email, password, username } = req.body;
    let user1 = new NewUser({ email, password, username });
    let reg = await NewUser.register(user1, password);
    req.login(reg, (err) => {
      if (err) return next(err);
      req.flash("success", "welcome to wanderlust");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

const login = async (req, res) => {
  req.flash("success", "welcome to wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
  });
  req.flash("error", "You are logged out!");
  res.redirect("/listings");
};
module.exports = { signup, login, logout };

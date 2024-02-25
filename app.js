if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express"); // Import Express.js framework
const app = express(); // Create an instance of Express application
const mongoose = require("mongoose"); // Import Mongoose for MongoDB integration
const ejs = require("ejs"); // Import EJS for templating
const path = require("path"); // Import Path module for working with file and directory paths
const port = 3000; // Define the port number for the server
const methodOverride = require("method-override"); // Import method-override for HTTP method override
const ejsMate = require("ejs-mate"); // Import ejs-mate for rendering EJS templates
const ExpressErr = require("./utils/ExpressErr.js"); // Import custom error handler
const listingsRouter = require("./routes/listing.js"); // Import routes for listings
const reviewRouter = require("./routes/review.js"); // Import routes for reviews
const UserRouter = require("./routes/user.js"); // Import the User model
const session = require("express-session"); // Import express-session for session management
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); // Import connect-flash for flash messages
const passport = require("passport"); // Import passport for authentication
const LocalStrategy = require("passport-local"); // Import passport-local for local authentication strategy
const User = require("./Models/user.js"); // Import the User model

//All middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views/listings"));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));

//main function to connect with mongodb
const URL = process.env.MONGO_ATLAS_URL;
const session_secret = process.env.SESSION_SECRET;
async function main() {
  await mongoose.connect(URL);
}
main().catch((err) => console.log(err));
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

const store = MongoStore.create({
  mongoUrl: URL,
  crypto: {
    secret: session_secret,
  },
  touchAfter: 24 * 60 * 60,
});
store.on("error", () => {
  console.log("some error occured in mongo store", err);
});
let sessionOption = {
  store,
  secret: session_secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

/* The middlewares for session */
app.use(session(sessionOption));
app.use(flash());
/* The middlewares for authentication */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //the function is used to store user info in session
passport.deserializeUser(User.deserializeUser()); //the function is used to remove user info from session

/*-------------- All modules --------------*/
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.loggedIn = req.user;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});
/*-------------- All modules --------------*/
app.use("/", listingsRouter);
app.use("/", UserRouter);
app.use("/listing/:id/reviews", reviewRouter);

/*-------------- Page doesn't exist --------------*/
app.all("*", (req, res, next) => {
  next(new ExpressErr(440, "not found"));
});

/*-------------- Error handling middleware function. --------------*/
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("err", { err });
});
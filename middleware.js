const Listing = require("./Models/listing");
const Review = require("./Models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressErr = require("./utils/ExpressErr");

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};
const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let updateIt = await Listing.findById(id);
  if (!updateIt.owner.equals(req.user._id)) {
    req.flash("error", "you don't have permission to make changes");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

const reviewAuthenticated = async (req, res, next) => {
  let { id, reviwesId } = req.params;
  let rev = await Review.findById(reviwesId);
  if (req.user._id.equals(rev.author)) {
    next();
  } else {
    req.flash("error", "You don't have permission to make changes");
    res.redirect(`/listing/${id}`);
  }
};

const validateByJoi = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressErr(400, result.error);
  }
  next();
};

const validateReview = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new ExpressErr(400, result.error);
  }
  next();
};

module.exports = {
  validateByJoi,
  reviewAuthenticated,
  isOwner,
  isAuthenticated,
  saveRedirectUrl,
  validateReview
};

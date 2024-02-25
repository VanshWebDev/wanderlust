const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressErr = require("../utils/ExpressErr");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const { reviewSchema } = require("../schema.js");
const { isAuthenticated, reviewAuthenticated } = require("../middleware.js");
const { addReview, deleteReview } = require("../Controllers/reviews.js");
const {validateReview}= require('../middleware.js')


//save review in DB
router.post("/", isAuthenticated, validateReview, wrapAsync(addReview));

//delete review from DB
router.delete(
  "/:reviwesId",
  isAuthenticated,
  reviewAuthenticated,
  wrapAsync(deleteReview)
);

module.exports = router;

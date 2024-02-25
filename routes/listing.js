const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isAuthenticated, isOwner } = require("../middleware.js");
const { listingSchema } = require("../schema.js");
const {
  index,
  show,
  createNew,
  updationForm,
  saveUpdation,
  search,
  deleteListing,
  formForNewListing,
} = require("../Controllers/listings");
const { validateByJoi } = require("../middleware.js");
const multer = require("multer");
const { storage, checkFileExtension } = require("../cloudConfig.js");
const Listing = require("../Models/listing.js");
const upload = multer({ fileFilter: checkFileExtension, storage: storage });

router
  .route("/listings")
  //listiong route to show all document
  .get(wrapAsync(index))
  //create new post and save it in DB
  .post(isAuthenticated, upload.single("image"), wrapAsync(createNew));

router
  .route("/listing/:id/edit")
  //show a form to update existing post
  .get(isAuthenticated, isOwner, wrapAsync(updationForm))
  //update and save existing post
  .post(
    isOwner,
    upload.single("image"),
    validateByJoi,
    wrapAsync(saveUpdation)
  );

//show all detail about a single post on click
router.get("/listing/:id", wrapAsync(show));

//render a form to create new post
router.get("/listings/new", isAuthenticated, formForNewListing);

router.get("/listings/search", wrapAsync(search));

//delete post
router.delete(
  "/listings/:id",
  isAuthenticated,
  isOwner,
  wrapAsync(deleteListing)
);

module.exports = router;

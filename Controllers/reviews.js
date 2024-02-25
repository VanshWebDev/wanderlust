const Review = require("../Models/review");
const Listing = require("../Models/listing");

const addReview = async (req, res) => {
  let data = new Review(req.body);
  data.author = req.user._id;
  await data.save();
  const singleListing = await Listing.findById(req.params.id);
  singleListing.reviews.push(data);
  singleListing.save();
  req.flash("success", "Review Added");
  res.redirect(`/listing/${req.params.id}`);
};

const deleteReview = async (req, res) => {
  let { id, reviwesId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviwesId } });
  res.redirect(`/listing/${id}`);
};

module.exports = { addReview, deleteReview };

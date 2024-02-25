const Listing = require("../Models/listing");
const multer = require("multer");
const { isAuthenticated } = require("../middleware");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// it will show all listing
const index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("index", { allListings });
};

// it will show a single listing
const show = async (req, res) => {
  let { id } = req.params;
  let singleListing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (singleListing == null) {
    req.flash("error", "The post you are trying to access doesn't exist");
    res.redirect("/listings");
  } else if (singleListing) {
    res.render("show", { singleListing });
  }
};

const formForNewListing = (req, res) => {
  res.render("new");
};

// create new post and save in DB
const createNew = async (req, res, next) => {
  console.log(req.file);
  if (!req.file) {
    throw new Error("upload file");
  }
  let cordinate = await geocodingClient
    .forwardGeocode({
      query: `${req.body.location} , ${req.body.country}`,
      limit: 1,
    })
    .send();
  let { path, filename } = req.file;
  let { title, description, price, category, location, country } = req.body;
  let owner = req.user._id;
  let newList = new Listing({
    title: title,
    description: description,
    price: price,
    image: {
      url: path,
      filename: filename,
    },
    category: category.toLowerCase(),
    geometry: cordinate.body.features[0].geometry,
    location: location,
    country: country,
    owner: owner,
  });

  await newList.save().then((res)=>console.log(res))
  req.flash("success", "Post added");
  res.redirect("/listings");
};

//render a forn to update
const updationForm = async (req, res) => {
  let { id } = req.params;
  let singleEdit = await Listing.findById(id);
  if (singleEdit == null) {
    req.flash("error", "The post you are trying to access doesn't exist");
    res.redirect("/listings");
  }
  singleEdit.image.url.replace("/upload", "/upload/h_300,w_250");
  res.render("edit", { singleEdit });
};

//save updation in DB
const saveUpdation = async (req, res) => {
  let { id } = req.params;
  let { _id, title, description, price, location, country } = req.body;
  let cordinate = await geocodingClient
    .forwardGeocode({
      query: `${location} , ${country}`,
      limit: 1,
    })
    .send();
  await Listing.updateOne(
    { _id: id }, // Specify the filter for the update
    {
      title,
      description,
      price,
      location,
      country,
      geometry: cordinate.body.features[0].geometry,
    } // Specify the updated fields
  );
  if (req.file) {
    let { path, filename } = req.file;
    await Listing.findByIdAndUpdate(
      { _id: id },
      { image: { url: path, filename: filename } }
    );
  }
  req.flash("success", "Post Updated");
  res.redirect(`/listing/${id}`);
};

//search
const search = async (req, res) => {
  let d = req.query.search;
  d = d.toLowerCase();
  let allListings = await Listing.find({ category: d });
  if (allListings.length === 0) {
    res.send("no listing found");
    return;
  }
  res.render("index", { allListings });
};

//delete post from DB
const deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("error", "Post deleted");
  res.redirect("/listings");
};

//now export all function
module.exports = {
  index,
  show,
  formForNewListing,
  createNew,
  updationForm,
  saveUpdation,
  search,
  deleteListing,
};

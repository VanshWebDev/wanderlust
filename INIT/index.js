const mongoose = require("mongoose");
const Data = require("./data");
const Listing = require("../Models/listing");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}
main().catch((err) => console.log(err));

async function seedDB() {
  await Listing.deleteMany({}).then(console.log("data deleted"));
  Data.data = Data.data.map((el) => ({ ...el, owner: "65ce038c44197f384d788322" }));
  await Listing.insertMany(Data.data).then(console.log("data added"));
}
seedDB();

const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const userSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
  },
  keywords: {
    type: String,
  },
});

userSchema.post("findOneAndDelete", async function (doc) {
  for (const i of doc.reviews) {
    await Review.findByIdAndDelete(i);
  }
});

// id, { $pull: { reviews: reviwesId } }
const Listing = mongoose.model("Listing", userSchema);
module.exports = Listing;

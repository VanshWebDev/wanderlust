const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchemsa = new Schema({
    comment:{
        type: String
    },
    rating:{
        type: Number
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Review = mongoose.model("Review", reviewSchemsa);
module.exports = Review;

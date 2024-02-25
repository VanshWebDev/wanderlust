const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userRegisterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userRegisterSchema.plugin(passportLocalMongoose);
const userRegister = mongoose.model("User", userRegisterSchema);
module.exports = userRegister;

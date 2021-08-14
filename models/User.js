const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  u_id: {
    type: String,
    required: true,
    max: 16
  },
  firstname: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  lastname: {
    type: String,
    reguired: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  gender: {
    type: String,
    required: true,
    min: 4,
    max: 10,
  },
  birthday: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  role:{
    type: String,
    required: true,
    min: 3,
    max: 64,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);

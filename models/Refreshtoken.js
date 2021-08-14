const mongoose = require("mongoose");

const refreshtokenSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 256,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Refreshtoken", refreshtokenSchema);
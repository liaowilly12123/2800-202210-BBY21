"use strict";
const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  higherEducation: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("tutor", tutorSchema);
module.exports = userModel;

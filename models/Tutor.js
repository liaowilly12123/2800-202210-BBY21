"use strict";
const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BBY_21_users",
    required: true,
    unique: true
  },
  higherEducation: {
    type: String,
  },
  experience: {
    type: String,
  },
  rating: {
    type: mongoose.Decimal128,
    default: 0.00
  },
  pricing: {
    type: mongoose.Decimal128,
    default: 0.00
  },
  topics: {
    type: [String]
  }
});

const tutorModel = mongoose.model(
  "BBY_21_tutors",
  tutorSchema
);
module.exports = tutorModel;
"use strict";
const mongoose = require("mongoose");

const tutorQualificationsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BBY_21_user",
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

const tutorQualificationsModel = mongoose.model(
  "BBY21_tutor_qualifications",
  tutorQualificationsSchema
);
module.exports = tutorQualificationsModel;

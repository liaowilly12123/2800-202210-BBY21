"use strict";
const mongoose = require("mongoose");

const ratingsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BBY_21_users",
    required: true,
  },
  rater_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BBY_21_users",
    required: true,
  },
  rating: {
    type: mongoose.Decimal128,
    required: true,
  },
});

// Create compound unique indexes
// https://joshtronic.com/2018/06/07/unique-indexes-with-mongodb-and-mongoose/
ratingsSchema.index(
  {
    user_id: 1,
    rater: 1,
  },
  {
    unique: true,
  }
);

const ratingsModel = mongoose.model("BBY_21_ratings", ratingsSchema);
module.exports = ratingsModel;
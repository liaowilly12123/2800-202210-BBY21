"use strict";
const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BBY_21_user",
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  img: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BBY_21_Image",
    },
  ],
});

const timelineModel = mongoose.model("BBY_21_timeline", timelineSchema);
module.exports = timelineModel;

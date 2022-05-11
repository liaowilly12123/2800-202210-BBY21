"use strict";
const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const timelineModel = mongoose.model("BBY_21_timeline", timelineSchema);
module.exports = timelineModel;

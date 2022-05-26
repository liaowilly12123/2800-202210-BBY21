"use strict";
const mongoose = require("mongoose");

const bookmarksSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BBY_21_users",
    required: true,
    unique: true,
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BBY_21_tutors",
    },
  ],
});

const bookmarksModel = mongoose.model("BBY_21_bookmarks", bookmarksSchema);
module.exports = bookmarksModel;

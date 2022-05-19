"use strict";
const router = require("express").Router();
const Timeline = require("../../models/Timeline.js");

router.get("/posts", async function (req, res) {
  const { user_id } = req.query;

  const timelinePosts = await Timeline.find({ user_id: user_id }).sort([
    ["date", "desc"],
  ]);

  res.success({ posts: timelinePosts });
});

module.exports = router;

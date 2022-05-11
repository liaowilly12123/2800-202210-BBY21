"use strict";
const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../../models/User.js");
router.use(bodyParser.urlencoded({ extended: true }));

// Checks if data is undefined and sends a fail message back to the client if it
// is.
// Returns true if data is undefined, else false
function validate(res, data, msg) {
  if (typeof data === "undefined") {
    res.fail(msg);
    return true;
  }
  return false;
}

router.get("/info", async function (req, res) {
  let tutorId = req.session.userId;
  if (req.query.id != "null") {
    tutorId = req.query.id;
  }

  if (validate(res, tutorId, "Tutor id not provided")) return;

  if (!mongoose.isValidObjectId(tutorId)) {
    return res.fail(`${tutorId} is an invalid id`);
  }

  const tutor = await User.findById(tutorId);
  if (tutor === null) {
    return res.fail(`Tutor with id ${tutorId} not found`);
  }

  if (tutor.userType !== "tutor") {
    return res.fail(`User with id ${tutorId} is not a tutor.`);
  }

  return res.success({
    firstName: tutor.firstName,
    lastName: tutor.lastName,
    email: tutor.email,
    userType: tutor.userType,
    joinDate: tutor.joinDate,
  });
});

module.exports = router;

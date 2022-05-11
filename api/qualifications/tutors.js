"use strict";
const router = require("express").Router();
const tutor = require("../../models/Tutor.js");

// Checks if data is undefined and sends a fail message back to the client if it
// is.
// Returns true if data is undefined, else false
function validate(res, data, msg) {
  if (typeof data === "undefined" || data === null) {
    res.fail(msg);
    return true;
  }
  return false;
}

router.post("/tutors", async function (req, res) {
  const body = req.body;
  if (validate(res, body, "Request body is undefined")) return;

  const firstName = body.firstName;
  if (validate(res, firstName, "First Name is undefined")) return;

  const lastName = body.lastName;
  if (validate(res, lastName, "Last Name is undefined")) return;

  const higherEducation = body.higherEducation;
  if (validate(res, higherEducation, "higher Education is undefined")) return;

  const experience = body.experience;
  if (validate(res, experience, "experience is undefined")) return;

  const newUser = new tutor({
    firstName: firstName,
    lastName: lastName,
    higherEducation: higherEducation,
    experience: experience,
  });

  await newUser.save();

  req.session.loggedIn = true;
  req.session.userId = newUser._id;
  req.session.save((_) => {});

  res.success({
    userId: newUser._id,
  });
});

module.exports = router;

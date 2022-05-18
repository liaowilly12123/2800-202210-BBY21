"use strict";
const router = require("express").Router();
const Tutor = require("../../models/Tutor.js");
const User = require("../../models/User.js");

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

router.put('/info', async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail("User not logged in");
  }

  if (!["admin", "tutor"].includes(req.session.userType)) {
    return res.fail(
      `User does not have permission: userType: ${req.session.userType}`
    );
  }

  // Finds tutor document by user ID and updates if found, else create a new document.
  Tutor.findOneAndUpdate(
    { user_id: req.session.userId },
    { ...removeEmpty(req.body) },
    {
      setDefaultsOnInsert: true,
      new: true,
      upsert: true,
      returnDocument: "after",
    },
    function (err, result) {
      if (err) {
        return res.fail(`${err}. Unable to create/update tutor info`);
      }
      return res.success(result);
    }
  );
});

router.get("/all", async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail("User not logged in");
  }

  // https://javascript.plainenglish.io/simple-pagination-with-node-js-mongoose-and-express-4942af479ab2
  const { page = 1, limit = 20 } = req.query;

  // https://stackoverflow.com/questions/26691543/return-certain-fields-with-populate-from-mongoose  
  const tutors = await Tutor.find()
    .populate('user_id', 'firstName lastName')
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPages = Math.ceil((await Tutor.count()) / limit);

  return res.success({ tutors: tutors, totalPages: totalPages });
});

/**
 * Removes undefined, null, and empty values
 * https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
 */
function removeEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != null && value != "")
  );
}
module.exports = router;

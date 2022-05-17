"use strict";
const router = require("express").Router();
const Tutor = require("../../models/Tutor.js");

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

router.put("/info", async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail("User not logged in");
  }

  if (!["admin", "tutor"].includes(req.session.userType)) {
    return res.fail(
      `User does not have permission: userType: ${req.session.userType}`
    );
  }

  /**
   * Finds tutor document by user ID and updates if found, else creates
   * a new document.
   */
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

/**
 * Removes undefined, null, and empty values
 * https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
 */
function removeEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value != null && value != ""
    )
  );
}
module.exports = router;

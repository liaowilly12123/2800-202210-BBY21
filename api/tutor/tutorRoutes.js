"use strict";
const router = require("express").Router();
const Tutor = require("../../models/Tutor.js");

router.put("/info", async function (req, res) {
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

// Gets tutor information and filters by price, rating, and/or topics
router.post("/all", async function (req, res) {
  // if (!req.session.loggedIn) {
  //   return res.fail("User not logged in");
  // }

  const { topics, pricing, rating } = removeEmpty(req.body);

  // https://javascript.plainenglish.io/simple-pagination-with-node-js-mongoose-and-express-4942af479ab2
  const { page = 1, limit = 20 } = req.query;

  // https://stackoverflow.com/questions/8145523/mongodb-find-by-multiple-array-items
  let findByTopics = {};

  if (topics) {
    findByTopics.topics = { $in: topics };
  }

  // https://kb.objectrocket.com/mongo-db/mongoose-sort-multiple-fields-609
  let filters = [];

  if (pricing && ['asc', 'desc'].includes(pricing)) {
    filters.push(['pricing', pricing]);
  }

  if (rating && ['asc', 'desc'].includes(rating)) {
    filters.push(['rating', rating]);
  }

  // https://stackoverflow.com/questions/26691543/return-certain-fields-with-populate-from-mongoose
  const tutors = await Tutor.find(findByTopics)
    .populate("user_id", "firstName lastName")
    .sort(filters)
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

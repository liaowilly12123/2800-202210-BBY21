'use strict';
const router = require('express').Router();
const mongoose = require('mongoose');
const Tutor = require('../../models/Tutor.js');
const Rating = require('../../models/Rating.js');
const validate = require('../../utils/validationUtils.js');

router.get('/info', async function (req, res) {
  let userId =
    req.query.userId === 'null' ? req.session.userId : req.query.userId;

  if (validate(res, userId, 'User id not provided')) return;

  if (!mongoose.isValidObjectId(userId)) {
    return res.fail(`${userId} is an invalid id`);
  }

  const info = await Tutor.findOne({ user_id: userId });
  if (info === null) {
    return res.fail('Tutor not found');
  }
  return res.success(info);
});

router.put('/info', async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail('User not logged in');
  }

  if (!['admin', 'tutor'].includes(req.session.userType)) {
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
      returnDocument: 'after',
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
router.post('/all', async function (req, res) {
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
    .populate('user_id', 'firstName lastName')
    .sort(filters)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPages = Math.ceil((await Tutor.count()) / limit);

  return res.success({ tutors: tutors, totalPages: totalPages });
});

router.post('/ratings', async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail('User not logged in');
  }

  const userId = req.query.userId;
  const rating = req.body.rating;

  if (userId == req.session.userId) {
    return res.fail('You cannot rate yourself');
  }

  if (!mongoose.isValidObjectId(userId)) {
    return res.fail(`${userId} is an invalid id`);
  }

  Rating.findOneAndUpdate(
    { user_id: userId, rater_id: req.session.userId },
    { rating: rating },
    { upsert: true },
    function (err, result) {
      if (err) {
        return res.fail('Failed to rate user');
      }
      return res.success('Successfully rated user');
    }
  );
});

router.get('/ratings', async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail('User not logged in');
  }

  let userId = req.query.userId === 'null' ? req.body.userId : req.query.userId;

  if (userId === undefined) {
    userId = req.session.userId;
  }

  if (!mongoose.isValidObjectId(userId)) {
    return res.fail(`${userId} is an invalid id`);
  }

  const numRatings = await Rating.countDocuments({ user_id: userId });

  // https://jsshowcase.com/question/how-to-sum-field-values-in-collections-in-mongoose
  const totalRatingValue = await Rating.aggregate([
    {
      $match: {
        user_id: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        value: {
          $sum: '$rating',
        },
      },
    },
    { $unset: ['_id'] },
  ]);

  res.success({ count: numRatings, totalRating: totalRatingValue });
});

router.put('/tutorRating', async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail('User not logged in');
  }

  let userId = req.query.userId === 'null' ? req.body.userId : req.query.userId;

  if (!mongoose.isValidObjectId(userId)) {
    return res.fail(`${userId} is an invalid id`);
  }

  // Finds tutor document by user ID and updates if found, else create a new document.
  Tutor.findOneAndUpdate(
    { user_id: userId },
    { ...removeEmpty(req.body) },
    {
      setDefaultsOnInsert: true,
      new: true,
      upsert: true,
      returnDocument: 'after',
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
    Object.entries(obj).filter(([_, value]) => value != null && value != '')
  );
}
module.exports = router;

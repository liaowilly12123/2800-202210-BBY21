'use strict';
const router = require('express').Router();
const multer = require('multer');
const validate = require('../../utils/validationUtils.js');
const mongoose = require('mongoose');
const Timeline = require('../../models/Timeline.js');
const Image = require('../../models/image.js');

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads');
  },
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

router.get('/posts', async function (req, res) {
  let userId =
    req.query.userId === 'null' ? req.session.userId : req.query.userId;

  if (validate(res, userId, 'User id not provided')) return;

  if (!mongoose.isValidObjectId(userId)) {
    return res.fail(`${userId} is an invalid id`);
  }

  const timelinePosts = await Timeline.find({ user_id: userId })
    .sort([['date', 'desc']])
    .populate('img', 'img');
  res.success({ posts: timelinePosts });
});

router.post('/new', async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail('User not logged in');
  }

  if (req.session.userType === 'student') {
    return res.fail("Students can't make posts");
  }

  const { heading, desc, img } = req.body;
  if (validate(res, heading, 'Invalid Heading')) return;
  if (validate(res, desc, 'Invalid description')) return;
  if (validate(res, img, 'Invalid Image')) return;

  if (!img.length) {
    return res.fail('Post needs atleast one image');
  }

  const tl = new Timeline({
    user_id: req.session.userId,
    heading: heading,
    description: desc,
    img: img,
    date: Date.now(),
  });
  await tl.save();

  return res.success();
});

// https://stackoverflow.com/questions/39350040/uploading-multiple-files-with-multer
router.post('/uploadphoto', upload.array('images'), async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail('User not logged in');
  }

  let images = [];

  for (const file of req.files) {
    const doc = new Image({
      user_id: req.session.userId,
      img: file.path,
    });

    await doc.save();

    images.push(doc._id);
  }

  return res.success({ ids: images });
});

router.put('/update', function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail('User is not logged in.');
  }

  const postId = req.body.postId;
  if (validate(res, postId, 'Post ID is undefined')) return;

  const payload = req.body.payload;
  // Validate each entry of the payload, cannot be null or undefined
  for (const entry of Object.entries(payload)) {
    if (validate(res, entry[1], `${entry[0]} is undefined or null`)) return;
  }

  Timeline.findByIdAndUpdate(
    postId,
    payload,
    { returnDocument: 'after' },
    function (err, result) {
      if (err) {
        return res.fail(`${err}. Unable to update user profile.`);
      }
      return res.success(result);
    }
  );
});

router.delete('/delete', function (req, res) {
  const postId = req.body.postId;
  Timeline.findByIdAndDelete(postId, function (err) {
    if (err) {
      return res.fail('Error deleting post');
    }
    return res.success();
  });
});

module.exports = router;

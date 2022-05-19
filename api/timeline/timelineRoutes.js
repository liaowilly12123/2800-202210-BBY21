const router = require('express').Router();
const validate = require('../../utils/validationUtils.js');
const Timeline = require('../../models/Timeline.js');

router.get('/posts', async function (req, res) {
  const { user_id } = req.query;

  const timelinePosts = await Timeline.find({ user_id: user_id }).sort([
    ['date', 'desc'],
  ]);

  res.success({ posts: timelinePosts });
});

router.post('/new', function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail('User not logged in');
  }

  if (req.session.userType === 'student') {
    return res.fail("Students can't make posts");
  }

  const { heading, desc, img } = req.body;
  if (!validate(heading)) return res.fail('Invalid heading');
  if (!validate(desc)) return res.fail('Invalid description');
  if (!validate(img)) return res.fail('Invalid image');

  new Timeline({
    user_id: req.session.userId,
    heading: heading,
    description: desc,
    img: img,
    date: Date.now(),
  });

  res.success();
});

module.exports = router;

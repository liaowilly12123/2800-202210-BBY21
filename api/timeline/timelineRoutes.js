const router = require('express').Router();
const validate = require('../../utils/validationUtils.js');
const Timeline = require('../../models/Timeline.js');
const Image = require('../../models/image.js');

router.get('/posts', async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail('User is not logged in!');
  }

  const user_id = req.session.userId;

  const timelinePosts = await Timeline.find({ user_id: user_id }).sort([
    ['date', 'desc'],
  ]);

  const postsWithImage = await Promise.all(
    timelinePosts.map(async function (value) {
      return { ...value._doc, img: (await Image.findById(value._doc.img)).img };
    })
  );

  res.success({ posts: postsWithImage });
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

module.exports = router;

const router = require("express").Router();
const multer = require("multer");
const validate = require("../../utils/validationUtils.js");
const Timeline = require("../../models/Timeline.js");
const Image = require("../../models/image.js");
const { append } = require("express/lib/response");

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads");
  },
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

router.get("/posts", async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail("User is not logged in!");
  }

  const user_id = req.session.userId;

  const timelinePosts = await Timeline.find({ user_id: user_id }).sort([
    ["date", "desc"],
  ]);

  const postsWithImage = await Promise.all(
    timelinePosts.map(async function (value) {
      return { ...value._doc, img: (await Image.findById(value._doc.img)).img };
    })
  );

  res.success({ posts: postsWithImage });
});

router.post("/new", async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail("User not logged in");
  }

  if (req.session.userType === "student") {
    return res.fail("Students can't make posts");
  }

  const { heading, desc, img } = req.body;
  if (validate(res, heading, "Invalid Heading")) return;
  if (validate(res, desc, "Invalid description")) return;
  if (validate(res, img, "Invalid Image")) return;

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
router.post("/uploadphoto", upload.array("images"), async function (req, res) {
  if (!req.session.loggedIn) {
    return res.fail("User not logged in");
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

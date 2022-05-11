"use strict";
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const multer = require("multer");
const session = require("express-session");
const apiRoutes = require("./api/apiRoutes.js");
const responseMiddleware = require("./middleware/responseMiddleware.js");
const imageSchema = require("./models/image.js");
const app = express();

const MONGOOSE_URI =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/COMP2800";
const PORT = process.env.PORT ?? 8000;

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads");
  },
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage: storage });

async function main() {
  await mongoose.connect(MONGOOSE_URI);

  app.use("/css", express.static("./public/css"));
  app.use("/js", express.static("./public/js"));
  app.use("/img", express.static("./public/img"));

  // Set express-session options
  app.use(
    session({
      name: "tuttoria",
      secret: "tuttoriasecret",
      saveUninitialized: true,
      resave: false,
    })
  );

  // Utility functions to send responses
  app.use(responseMiddleware);
  // Parse incoming payloads as json
  app.use(express.json());

  app.use("/api", apiRoutes);

  app.get("/", function (req, res) {
    if (req.session.userType) {
      return res.redirect("/profile");
    }
    const doc = fs.readFileSync("./public/html/landing.html", "utf8");
    return res.send(doc);
  });

  app.get("/signup", function (_, res) {
    const doc = fs.readFileSync("./public/html/signup.html", "utf8");
    res.send(doc);
  });

  app.get("/profile", function (req, res) {
    let doc;

    if (req.session.userType === "admin") {
      doc = fs.readFileSync("./public/html/dashboard.html", "utf8");
    } else {
      doc = fs.readFileSync("./public/html/profile.html", "utf8");
    }
    return res.send(doc);
  });

  app.get("/tutors", function (_, res) {
    let doc = fs.readFileSync("./public/html/tutors.html", "utf8");
    return res.send(doc);
  });

  app.post("/uploadphoto", upload.single("myImage"), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString("base64");
    var final_img = {
      contentType: req.file.mimetype,
      image: new Buffer(encode_img, "base64"),
    };
    imageSchema.create(final_img, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result.img.Buffer);
        console.log("Saved To database");
        res.contentType(final_img.contentType);
        res.send(final_img.image);
      }
    });
  });
}

app.listen(PORT, main);

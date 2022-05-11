"use strict";
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const session = require("express-session");
const apiRoutes = require("./api/apiRoutes.js");
const responseMiddleware = require("./middleware/responseMiddleware.js");
const app = express();

const MONGOOSE_URI = "mongodb://127.0.0.1:27017/tutorria";

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

    app.get("/", function(req, res) {
        if (req.session.userType == "admin") {
            return res.redirect("/dashboard");
        } else if (req.session.userType == "tutor") {
            return res.redirect("/tutors");
        } else if (req.session.userType) {
            return res.redirect("/profile");
        }
        const doc = fs.readFileSync("./public/html/landing.html", "utf8");
        return res.send(doc);
    });

    app.get("/signup", function(_, res) {
        const doc = fs.readFileSync("./public/html/signup.html", "utf8");
        res.send(doc);
    });

    app.get("/dashboard", function(req, res) {
        if (req.session.userType !== "admin") {
            return res.redirect("/");
        }

        const doc = fs.readFileSync("./public/html/dashboard.html", "utf8");
        return res.send(doc);
    });
    app.get("/tutors", function(req, res) {
        const doc = fs.readFileSync("./public/html/tutors.html", "utf8");
        return res.send(doc);
    });
    app.get("/profile", function(_, res) {
        const doc = fs.readFileSync("./public/html/profile.html", "utf8");
        res.send(doc);
    });

}

app.listen(8000, main);
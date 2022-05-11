"use strict";
const router = require("express").Router();
const userRoutes = require("./user/userRoutes.js");
const userRoutes1 = require("./qualifications/tutors.js");
router.use("/user", userRoutes);
router.use("/qualifications", userRoutes1);
module.exports = router;

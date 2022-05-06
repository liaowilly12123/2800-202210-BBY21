'use strict';
const router = require("express").Router()
const userRoutes = require("./user/userRoutes.js")

router.use("/user", userRoutes)

module.exports = router

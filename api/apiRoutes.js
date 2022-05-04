const router = require("express").Router()
const userRoutes = require("./user/userRoutes.js")
const studentRoutes = require("./student/studentRoutes.js")

router.use("/user", userRoutes)
router.use("/student", studentRoutes)

module.exports = router

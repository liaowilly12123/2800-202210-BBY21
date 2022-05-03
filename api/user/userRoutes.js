const router = require("express").Router()

router.post("/register", function(req, res) {
    res.json({ status: 'success' })
})

module.exports = router

const router = require("express").Router()
const res = require("express/lib/response");
const User = require("../../models/User.js")

// Checks if data is undefined and sends a fail message back to the client if it
// is.
// Returns true if data is undefined, else false/
function validate(res, data, msg) {
    if (typeof data === 'undefined') {
        res.fail(msg)
        return true;
    }
    return false;
}

router.put("/update", async function(req, res) {
    if (!req.session.loggedIn) {
        return res.fail("User is not logged in.")
    }
    
    if (req.session.userType !== "student") {
        return res.fail("User is not type student.")
    }

    const userId = req.session.userId
    if (validate(res, userId, "User ID is undefined")) return

    const payload = req.body.payload
    
    User.findByIdAndUpdate(userId, payload, function(err) {
        if (err) {
            return res.fail(`${err}`)
        }
        return res.success()
    })
})


module.exports = router

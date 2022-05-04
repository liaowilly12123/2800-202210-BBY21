const router = require("express").Router()
const User = require("../../models/User.js")

// Checks if data is undefined and sends a fail message back to the client if it
// is.
// Returns true if data is undefined, else false
function validate(res, data, msg) {
    if (typeof data === 'undefined') {
        res.fail(msg)
        return true;
    }
    return false;
}

router.post("/register", async function(req, res) {
    const body = req.body
    if (validate(res, body, "Request body is undefined")) return

    const firstName = body.firstName
    if (validate(res, firstName, "First Name is undefined")) return

    const lastName = body.lastName
    if (validate(res, lastName, "Last Name is undefined")) return

    const email = body.email
    if (validate(res, email, "Email is undefined")) return

    const password = body.password
    if (validate(res, password, "Password is undefined")) return

    const userType = body.userType
    if (validate(res, userType, "User type is undefined")) return

    const possibleTypes = User.prototype.schema.paths.userType.enumValues
    if (!possibleTypes.includes(userType)) {
        return res.fail(`Invalid user type: ${userType}`)
    }

    // https://stackoverflow.com/questions/8389811/how-to-query-mongodb-to-test-if-an-item-exists
    const hasUser = await User.countDocuments({ email: email }, { limit: 1 }) == 1
    if (hasUser) {
        return res.fail("User already exists")
    }

    const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        userType: userType,
        joinDate: new Date()
    })
    await newUser.save()

    res.success()
})

router.post("/login", async function(req, res) {
    if (req.session.loggedIn) {
        return res.fail("User is already logged in.")
    }

    const { email, password } = req.body

    if (validate(res, email, "Email is undefined")) return
    if (validate(res, password, "Password is undefined")) return

    const user = await User.findOne({ email: email, password: password })
    if (user === null) {
        return res.fail("Invalid Credentials")
    }

    // Create a session for the user
    req.session.loggedIn = true
    req.session.userId = user._id
    req.session.userType = user.userType
    req.session.save((_) => { })

    res.success({
        userType: user.userType,
        userId: user._id
    })
})

router.get("/logout", function(req, res) {
    if (!req.session.loggedIn) {
        return res.fail("User is not logged in.")
    }

    req.session.destroy((err) => {
        if (err) {
            return res.fail("Unable to log out.")
        }
    })

    res.success("Successfully logged out.")
})

module.exports = router

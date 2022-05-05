const express = require("express")
const fs = require("fs")
const mongoose = require("mongoose")
const session = require("express-session")
const apiRoutes = require("./api/apiRoutes.js")
const responseMiddleware = require("./middleware/responseMiddleware.js")
const req = require("express/lib/request")

const app = express()

const MONGOOSE_URI = "mongodb://127.0.0.1:27017/tutorria"

async function main() {
    await mongoose.connect(MONGOOSE_URI)

    app.use("/css", express.static("./public/css"))
    app.use("/js", express.static("./public/js"))
    app.use("/img", express.static("./public/img"))

    // Set express-session options
    app.use(session({
        name: "tuttoria",
        secret: "tuttoriasecret",
        saveUninitialized: true,
        resave: false
    }))

    // Utility functions to send responses
    app.use(responseMiddleware)
    // Parse incoming payloads as json
    app.use(express.json())

    app.use("/api", apiRoutes)

    app.get("/", function(req, res) {
        if (req.session.userType == "admin") {
            res.redirect("/dashboard")
        } else if (req.session.userType) {
            res.redirect("/profile")
        }
        const doc = fs.readFileSync("./public/html/landing.html", "utf8")
        res.send(doc)
    })
}

app.listen(8000, main)

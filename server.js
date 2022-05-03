const express = require("express")
const fs = require("fs")
const mongoose = require("mongoose")
const app = express()

const MONGOOSE_URI = "mongodb://127.0.0.1:27017/tutorria"

async function main() {
    await mongoose.connect(MONGOOSE_URI)

    app.use("/css", express.static("./public/css"))
    app.use("/js", express.static("./public/js"))

    app.get("/", function(_, res) {
        const doc = fs.readFileSync("./public/html/landing.html", "utf8")
        res.send(doc)
    })
}

app.listen(8000, main)

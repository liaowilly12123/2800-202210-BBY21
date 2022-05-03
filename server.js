const express = require("express")
const fs = require("fs")
const app = express()

async function main() {
    app.use("/css", express.static("./public/css"))
    app.use("/js", express.static("./public/js"))

    app.get("/", function(_, res) {
        const doc = fs.readFileSync("./public/html/landing.html", "utf8")
        res.send(doc)
    })
}

app.listen(8000, main)

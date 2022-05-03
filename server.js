const express = require("express")
const app = express()

async function main() {
    console.log("Started listening!")
}

app.listen(8000, main)

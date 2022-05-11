"use strict";
const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    higherEducation: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    hourlyPay: {
        type: String,
    }

});

const userModel = mongoose.model("tutor", tutorSchema);
module.exports = userModel;
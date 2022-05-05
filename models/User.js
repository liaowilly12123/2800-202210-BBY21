const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: {
            values: ['tutor', 'student', 'admin'],
        },
        required: true
    },
    joinDate: {
        type: Date,
        required: true,
    }
})

const userModel = mongoose.model("User", userSchema)
module.exports = userModel;

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
            values: ['tutor', 'student', 'admin']
        }
    },
})

const userModel = mongoose.model("User", userSchema)
module.exports = userModel;

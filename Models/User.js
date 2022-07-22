const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: "",
        required: true,
    },
    password: {
        type: String,
        default: "",
        required: true,
    },
    resetToken: {
        type: String,
        default: ""
    },
    tokenValidity: {
        type: Date,
        default: ""
    }
})

module.exports = mongoose.model("User", userSchema);
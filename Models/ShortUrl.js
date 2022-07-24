const mongoose = require('mongoose');
const shortid = require('shortid');
const User = require("../Models/User");

const shortUrl = new mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        default: shortid.generate
    },
    clicks: {
        type: Number,
        default: 0
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("ShortUrl", shortUrl);
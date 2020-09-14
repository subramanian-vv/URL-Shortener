const mongoose = require('mongoose');
const shortid = require('shortid');

const LinkSchema = new mongoose.Schema({
    inputURL: {
        type: String,
        required: true
    },
    shortURL: {
        type: String,
        required: true,
        default: shortid.generate
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Link = mongoose.model('Link', LinkSchema);

module.exports = Link;
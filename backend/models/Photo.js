const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        index: true
    },

    storageKey: {
        type: String,
        required: true,
        unique: true
    },

    originalName: {
        type: String,
        default: ""
    },

    mimeType: {
        type: String,
        required: true
    },

    size: {
        type: Number,
        required: true
    },

    caption: {
        type: String,
        default: "",
        maxlength: 500
    }
});

const Photo = mongoose.model(
    "Photo",
    photoSchema
);

module.exports = Photo;
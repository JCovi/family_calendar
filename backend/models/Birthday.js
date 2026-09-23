const mongoose = require("mongoose");

const birthdaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },

    day: {
        type: Number,
        required: true,
        min: 1,
        max: 31
    },

    notes: {
        type: String,
        default: "",
        maxlength: 1000
    }
});

const Birthday = mongoose.model(
    "Birthday",
    birthdaySchema
);

module.exports = Birthday;
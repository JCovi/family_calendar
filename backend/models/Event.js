const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        trim: true,
        default: ""
    },
    notes: {
        type: String,
        trim: true,
        default: ""
    },
    createdBy: {
        type: String,
        default: ""
    },
    createdByName: {
        type: String,
        default: ""
    },
    familyId: {
        type: String,
        default: ""
    }
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
const express = require("express");
const router = express.Router();

const Event = require("../models/Event");

// GET all events, optionally filtered by month
router.get("/", async (req, res) => {
    try {
        const { month } = req.query;

        let filter = {};

        if (month) {
            filter.date = {
                $regex: `^${month}`
            };
        }

        const events = await Event.find(filter).sort({
            date: 1,
            startTime: 1
        });

        res.json(events);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve events."
        });
    }
});

// CREATE a new event
router.post("/", async (req, res) => {
    try {
        const {
            title,
            date,
            startTime,
            location,
            notes
        } = req.body;

        const event = await Event.create({
            title,
            date,
            startTime,
            location,
            notes
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create event."
        });
    }
});

module.exports = router;

// UPDATE an existing event
router.put("/:id", async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({
            message: "Failed to update event."
        });
    }
});

// DELETE an event
router.delete("/:id", async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        res.json({
            message: "Event deleted successfully."
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete event."
        });
    }
});
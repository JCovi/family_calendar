const express = require("express");
const Birthday = require("../models/Birthday");

const router = express.Router();


function isValidBirthdayDate(month, day) {
    const numericMonth = Number(month);
    const numericDay = Number(day);

    if (
        !Number.isInteger(numericMonth) ||
        !Number.isInteger(numericDay) ||
        numericMonth < 1 ||
        numericMonth > 12 ||
        numericDay < 1 ||
        numericDay > 31
    ) {
        return false;
    }

    // Use a leap year so February 29 is allowed.
    const testDate = new Date(
        2024,
        numericMonth - 1,
        numericDay
    );

    return (
        testDate.getMonth() === numericMonth - 1 &&
        testDate.getDate() === numericDay
    );
}


// GET BIRTHDAYS
router.get("/", async (req, res) => {
    try {
        const { month, day } = req.query;

        const filter = {};

        if (month !== undefined) {
            const numericMonth = Number(month);

            if (
                !Number.isInteger(numericMonth) ||
                numericMonth < 1 ||
                numericMonth > 12
            ) {
                return res.status(400).json({
                    message: "Invalid month."
                });
            }

            filter.month = numericMonth;
        }

        if (day !== undefined) {
            const numericDay = Number(day);

            if (
                !Number.isInteger(numericDay) ||
                numericDay < 1 ||
                numericDay > 31
            ) {
                return res.status(400).json({
                    message: "Invalid day."
                });
            }

            filter.day = numericDay;
        }

        const birthdays = await Birthday.find(filter).sort({
            month: 1,
            day: 1,
            name: 1
        });

        res.json(birthdays);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve birthdays."
        });
    }
});


// CREATE BIRTHDAY
router.post("/", async (req, res) => {
    try {
        const {
            name,
            month,
            day,
            notes = ""
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required."
            });
        }

        if (!isValidBirthdayDate(month, day)) {
            return res.status(400).json({
                message: "Invalid birthday date."
            });
        }

        const birthday = new Birthday({
            name: name.trim(),
            month: Number(month),
            day: Number(day),
            notes: notes.trim()
        });

        await birthday.save();

        res.status(201).json(birthday);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create birthday."
        });
    }
});


// UPDATE BIRTHDAY
router.put("/:id", async (req, res) => {
    try {
        const {
            name,
            month,
            day,
            notes = ""
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required."
            });
        }

        if (!isValidBirthdayDate(month, day)) {
            return res.status(400).json({
                message: "Invalid birthday date."
            });
        }

        const birthday =
            await Birthday.findByIdAndUpdate(
                req.params.id,
                {
                    name: name.trim(),
                    month: Number(month),
                    day: Number(day),
                    notes: notes.trim()
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!birthday) {
            return res.status(404).json({
                message: "Birthday not found."
            });
        }

        res.json(birthday);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update birthday."
        });
    }
});


// DELETE BIRTHDAY
router.delete("/:id", async (req, res) => {
    try {
        const birthday =
            await Birthday.findByIdAndDelete(
                req.params.id
            );

        if (!birthday) {
            return res.status(404).json({
                message: "Birthday not found."
            });
        }

        res.json({
            message: "Birthday deleted."
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete birthday."
        });
    }
});


module.exports = router;
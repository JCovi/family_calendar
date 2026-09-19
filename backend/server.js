require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const eventRoutes = require("./routes/events");

const app = express();

app.use(express.json());

app.use("/api/events", eventRoutes);

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Family Calendar API is running!");
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
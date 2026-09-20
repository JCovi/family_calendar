require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");

const requireAuth = require("./middleware/auth");

const app = express();

const PORT = process.env.PORT || 5000;

// Needed when deployed behind Render's HTTPS proxy.
app.set("trust proxy", 1);

// Parse JSON request bodies.
app.use(express.json());

// SESSION CONFIGURATION
app.use(
    session({
        name: "family_calendar_session",

        secret: process.env.SESSION_SECRET,

        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        }),

        cookie: {
            httpOnly: true,

            // Local development uses HTTP.
            // Production will use HTTPS.
            secure: process.env.NODE_ENV === "production",

            sameSite: "lax",

            // Stay logged in for 30 days.
            maxAge: 1000 * 60 * 60 * 24 * 30
        }
    })
);

// AUTHENTICATION API
app.use("/api/auth", authRoutes);

// PROTECTED EVENT API
app.use("/api/events", requireAuth, eventRoutes);

// Serve the frontend.
app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((error) => {
        console.error(
            "MongoDB connection error:",
            error
        );
    });

app.listen(PORT, () => {
    console.log(
        `Server is running on port ${PORT}`
    );
});
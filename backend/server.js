require("dotenv").config();

const requiredEnvVariables = [
    "MONGODB_URI",
    "SESSION_SECRET",
    "FAMILY_PASSWORD_HASH",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_ENDPOINT",
    "R2_BUCKET_NAME"
];

for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
        console.error(
            `Missing required environment variable: ${variable}`
        );

        process.exit(1);
    }
}

const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const helmet = require("helmet");

const eventRoutes = require("./routes/events");
const photoRoutes = require("./routes/photos");
const birthdayRoutes = require("./routes/birthdays");
const authRoutes = require("./routes/auth");

const requireAuth = require("./middleware/auth");

const app = express();

const PORT = process.env.PORT || 5000;

// Needed when deployed behind Render's HTTPS proxy.
app.set("trust proxy", 1);

// SECURITY HEADERS
app.use(helmet());

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

// PROTECTED APIs
app.use("/api/events", requireAuth, eventRoutes);
app.use("/api/photos", requireAuth, photoRoutes);
app.use(
    "/api/birthdays",
    requireAuth,
    birthdayRoutes
);

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

        app.listen(PORT, () => {
            console.log(
                `Server is running on port ${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection error:",
            error
        );

        process.exit(1);
    });
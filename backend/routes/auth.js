const express = require("express");
const argon2 = require("argon2");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        message: "Too many login attempts. Please try again later."
    }
});

// CHECK LOGIN STATUS
router.get("/status", (req, res) => {
    res.json({
        authenticated: Boolean(
            req.session && req.session.authenticated
        )
    });
});

// LOGIN
router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { password } = req.body;

        if (
            typeof password !== "string" ||
            password.length === 0
        ) {
            return res.status(400).json({
                message: "Password is required."
            });
        }

        const passwordMatches = await argon2.verify(
            process.env.FAMILY_PASSWORD_HASH,
            password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Incorrect password."
            });
        }

        req.session.regenerate((error) => {
            if (error) {
                console.error(error);

                return res.status(500).json({
                    message: "Login failed."
                });
            }

            req.session.authenticated = true;

            req.session.save((saveError) => {
                if (saveError) {
                    console.error(saveError);

                    return res.status(500).json({
                        message: "Login failed."
                    });
                }

                res.json({
                    message: "Login successful."
                });
            });
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Login failed."
        });
    }
});

// LOGOUT
router.post("/logout", (req, res) => {
    if (!req.session) {
        return res.json({
            message: "Logged out."
        });
    }

    req.session.destroy((error) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                message: "Logout failed."
            });
        }

        res.clearCookie("family_calendar_session");

        res.json({
            message: "Logged out."
        });
    });
});

module.exports = router;
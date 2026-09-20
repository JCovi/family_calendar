const crypto = require("crypto");

function getPasswordVersion() {
    return crypto
        .createHash("sha256")
        .update(process.env.FAMILY_PASSWORD_HASH)
        .digest("hex");
}

function requireAuth(req, res, next) {
    const validSession =
        req.session &&
        req.session.authenticated &&
        req.session.passwordVersion ===
            getPasswordVersion();

    if (validSession) {
        return next();
    }

    return res.status(401).json({
        message: "Authentication required."
    });
}

module.exports = requireAuth;
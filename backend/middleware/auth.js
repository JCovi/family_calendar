function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    }

    return res.status(401).json({
        message: "Authentication required."
    });
}

module.exports = requireAuth;
// Check if user session exists
function authMiddleware(req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  if (!req.session.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  req.user = req.session.user;
  next();
}

// Role-based access to routes
function roleMiddleware(role) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      return next();
    }

    if (req.session.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }

    req.user = req.session.user;
    next();
  };
}

module.exports = {
  authMiddleware,
  roleMiddleware,
};

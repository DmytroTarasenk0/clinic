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
function roleMiddleware(roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      return next();
    }

    const userRole = req.session.user.role;
    const authorized = Array.isArray(roles)
      ? roles.includes(userRole)
      : userRole === roles;

    if (!authorized) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }

    next();
  };
}

module.exports = {
  authMiddleware,
  roleMiddleware,
};

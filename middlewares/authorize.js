module.exports = (requiredPermission) => {
  return (req, res, next) => {
    // Make sure auth middleware ran first
    console.log("Checking permissions for user:", req.user);
    if (!req.user || !req.user.permissions) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user has the required permission
    if (!req.user.permissions.includes(requiredPermission)) {
      return res.status(403).json({ error: "Access denied ❌" });
    }

    next();
  };
};

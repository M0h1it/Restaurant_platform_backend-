const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assign user info
    req.user = {
      id: decoded.user_id,
      role_id: decoded.role_id,
      store_id: decoded.store_id
    };

    // Load permissions
    const [rows] = await db.query(
      `SELECT p.permission_name
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [req.user.role_id]
    );

    req.user.permissions = rows.map(r => r.permission_name); // ["manage_roles", ...]

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
};

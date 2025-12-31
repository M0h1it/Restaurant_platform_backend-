const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * CREATE STORE ACCESS (REGISTER)
 */
exports.register = async (req, res) => {
  const { store_id, role_id, name, email, password } = req.body;

  if (!store_id || !role_id || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // check existing user
    const [existing] = await db.query(
      "SELECT id FROM store_users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO store_users 
      (store_id, role_id, name, email, password) 
      VALUES (?, ?, ?, ?, ?)`,
      [store_id, role_id, name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Store access created ✅",
      user_id: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      `SELECT su.*, r.role_name 
       FROM store_users su
       JOIN roles r ON r.id = su.role_id
       WHERE su.email = ? AND su.status = 1`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
  {
    user_id: user.id,
    role_id: user.role_id,  // numeric ID of role
    store_id: user.store_id
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
        store_id: user.store_id
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

exports.getStaffByStore = async (req, res) => {
  const { store_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT su.id, su.name
       FROM store_users su
       JOIN roles r ON r.id = su.role_id
       WHERE su.store_id = ?
         AND r.role_name = 'staff'
         AND su.status = 1
       ORDER BY su.name ASC`,
      [store_id]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch staff list" });
  }
};

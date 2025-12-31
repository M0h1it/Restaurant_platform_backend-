const db = require("../config/db");

/**
 * CREATE ROLE
 */
exports.createRole = async (req, res) => {
  const { role_name, description } = req.body;

  if (!role_name) {
    return res.status(400).json({ error: "Role name is required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO roles (role_name, description)
       VALUES (?, ?)`,
      [role_name, description]
    );

    res.status(201).json({
      message: "Role created successfully ✅",
      role_id: result.insertId
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Role already exists" });
    }
    res.status(500).json({ error: "Failed to create role" });
  }
};

/**
 * GET ALL ROLES
 */
exports.getRoles = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM roles ORDER BY role_name"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

/**
 * GET SINGLE ROLE
 */
exports.getRoleById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM roles WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch role" });
  }
};

/**
 * UPDATE ROLE
 */
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { role_name, description, status } = req.body;

  try {
    await db.query(
      `UPDATE roles
       SET role_name = ?, description = ?, status = ?
       WHERE id = ?`,
      [role_name, description, status, id]
    );

    res.json({ message: "Role updated successfully ✅" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update role" });
  }
};

/**
 * DELETE ROLE
 */
exports.deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      "DELETE FROM roles WHERE id = ?",
      [id]
    );

    res.json({ message: "Role deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete role" });
  }
};

const db = require("../config/db");

/**
 * CREATE PERMISSION
 */
exports.createPermission = async (req, res) => {
  const { permission_name, description } = req.body;

  if (!permission_name) {
    return res.status(400).json({ error: "Permission name is required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO permissions (permission_name, description) VALUES (?, ?)",
      [permission_name, description]
    );

    res.status(201).json({
      message: "Permission created successfully ✅",
      permission_id: result.insertId
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Permission already exists" });
    }
    res.status(500).json({ error: "Failed to create permission" });
  }
};

/**
 * GET ALL PERMISSIONS
 */
exports.getPermissions = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM permissions ORDER BY permission_name"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch permissions" });
  }
};

/**
 * GET SINGLE PERMISSION
 */
exports.getPermissionById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM permissions WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Permission not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch permission" });
  }
};

/**
 * UPDATE PERMISSION
 */
exports.updatePermission = async (req, res) => {
  const { id } = req.params;
  const { permission_name, description } = req.body;

  try {
    await db.query(
      `UPDATE permissions
       SET permission_name = ?, description = ?
       WHERE id = ?`,
      [permission_name, description, id]
    );

    res.json({ message: "Permission updated successfully ✅" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update permission" });
  }
};

/**
 * DELETE PERMISSION (SAFE)
 */
exports.deletePermission = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if permission is assigned to any role
    const [[used]] = await db.query(
      "SELECT COUNT(*) AS count FROM role_permissions WHERE permission_id = ?",
      [id]
    );

    if (used.count > 0) {
      return res.status(400).json({
        error: "Permission is assigned to a role and cannot be deleted"
      });
    }

    await db.query(
      "DELETE FROM permissions WHERE id = ?",
      [id]
    );

    res.json({ message: "Permission deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete permission" });
  }
};
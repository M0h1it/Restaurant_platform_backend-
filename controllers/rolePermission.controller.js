const db = require("../config/db");

/**
 * ASSIGN / UPDATE PERMISSIONS TO ROLE
 * (This replaces old permissions)
 */
exports.assignPermissionsToRole = async (req, res) => {
  const { role_id, permission_ids } = req.body;

  if (!role_id || !Array.isArray(permission_ids)) {
    return res.status(400).json({
      error: "role_id and permission_ids[] are required"
    });
  }

  try {
    // Remove existing permissions
    await db.query(
      "DELETE FROM role_permissions WHERE role_id = ?",
      [role_id]
    );

    // Insert new permissions
    for (const permission_id of permission_ids) {
      await db.query(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
        [role_id, permission_id]
      );
    }

    res.json({
      message: "Permissions assigned to role successfully ✅"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to assign permissions"
    });
  }
};

/**
 * GET PERMISSIONS BY ROLE
 */
exports.getPermissionsByRole = async (req, res) => {
  const { role_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT p.id, p.permission_name, p.description
       FROM role_permissions rp
       JOIN permissions p ON p.id = rp.permission_id
       WHERE rp.role_id = ?
       ORDER BY p.permission_name`,
      [role_id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch role permissions"
    });
  }
};

/**
 * REMOVE SINGLE PERMISSION FROM ROLE
 */
exports.removePermissionFromRole = async (req, res) => {
  const { role_id, permission_id } = req.params;

  try {
    await db.query(
      "DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?",
      [role_id, permission_id]
    );

    res.json({
      message: "Permission removed from role ❌"
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to remove permission"
    });
  }
};
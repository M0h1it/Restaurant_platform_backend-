const express = require("express");
const router = express.Router();

const rolePermissionController = require("../controllers/rolePermission.controller");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

/**
 * ASSIGN / UPDATE PERMISSIONS TO ROLE
 * ADMIN ONLY
 */
router.post(
  "/role-permissions",
  auth,
  authorize("manage_roles"),
  rolePermissionController.assignPermissionsToRole
);

/**
 * GET ROLE PERMISSIONS
 */
router.get(
  "/role-permissions/:role_id",
  auth,
  authorize("manage_roles"),
  rolePermissionController.getPermissionsByRole
);

/**
 * REMOVE SINGLE PERMISSION
 */
router.delete(
  "/role-permissions/:role_id/:permission_id",
  auth,
  authorize("manage_roles"),
  rolePermissionController.removePermissionFromRole
);

module.exports = router;

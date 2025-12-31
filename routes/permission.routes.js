const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permission.controller");

// CREATE
router.post("/permission", permissionController.createPermission);

// READ
router.get("/permissions", permissionController.getPermissions);
router.get("/permission/:id", permissionController.getPermissionById);

// UPDATE
router.put("/permission/:id", permissionController.updatePermission);

// DELETE
router.delete("/permission/:id", permissionController.deletePermission);

module.exports = router;
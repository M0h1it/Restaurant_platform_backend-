const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");

// CREATE ROLE
router.post("/role", roleController.createRole);

// GET ALL ROLES
router.get("/roles", roleController.getRoles);

// GET SINGLE ROLE
router.get("/role/:id", roleController.getRoleById);

// UPDATE ROLE
router.put("/role/:id", roleController.updateRole);

// DELETE ROLE
router.delete("/role/:id", roleController.deleteRole);

module.exports = router;

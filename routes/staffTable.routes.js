const express = require("express");
const router = express.Router();
const controller = require("../controllers/staffTable.controller");

// assign / update tables
router.post("/staff/assign-tables", controller.assignTablesToStaff);

// get assigned tables staff-wise
router.get("/staff/:staff_id/tables", controller.getTablesByStaff);

// remove single assignment
router.delete(
  "/staff/:staff_id/table/:table_id",
  controller.removeTableFromStaff
);

module.exports = router;

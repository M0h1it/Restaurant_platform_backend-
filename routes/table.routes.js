const express = require("express");
const router = express.Router();
const tableController = require("../controllers/table.controller");

// CRUD routes
router.post("/table", tableController.addTable);
router.get("/table/floor/:floor_id", tableController.getTablesByFloor);
router.get("/table/:id", tableController.getTableById);
router.put("/table/:id", tableController.updateTable);
router.delete("/table/:id", tableController.deleteTable);

router.get(
  "/tables/floor-wise/:store_id",
  tableController.getTablesFloorWise
);

module.exports = router;

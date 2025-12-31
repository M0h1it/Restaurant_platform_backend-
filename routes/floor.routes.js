const express = require("express");
const router = express.Router();
const floorController = require("../controllers/floor.controller");

// CRUD
router.post("/floor", floorController.addFloor);
router.get("/floor/store/:store_id", floorController.getFloors);
router.get("/floor/:id", floorController.getFloorById);
router.put("/floor/:id", floorController.updateFloor);
router.delete("/floor/:id", floorController.deleteFloor);

module.exports = router;

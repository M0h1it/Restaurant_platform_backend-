const express = require("express");
const router = express.Router();
const storeController = require("../controllers/store.controller");

router.post("/store", storeController.createStore);
router.get("/store", storeController.getStores);

module.exports = router;

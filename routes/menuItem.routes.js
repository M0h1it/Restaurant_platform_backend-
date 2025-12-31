const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const menuItemController = require("../controllers/menuItem.controller");

router.post(
  "/menu-item",
  upload.single("image"),
  menuItemController.addMenuItem
);

router.get(
  "/menu-item/category/:category_id",
  menuItemController.getMenuItemsByCategory
);

router.get(
  "/menu-item/store/:store_id",
  menuItemController.getMenuItemsByStore
);

router.put(
  "/menu-item/:id",
  upload.single("image"),
  menuItemController.updateMenuItem
);

router.delete(
  "/menu-item/:id",
  menuItemController.deleteMenuItem
);

module.exports = router;

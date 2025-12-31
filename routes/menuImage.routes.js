const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMenuImage");
const menuImageController = require("../controllers/menuImage.controller");

router.post(
  "/menu-image",
  upload.single("image"),
  menuImageController.addMenuImage
);

router.put(
  "/menu-image/:id",
  upload.single("image"),
  menuImageController.updateMenuImage
);

router.delete(
  "/menu-image/:id",
  menuImageController.deleteMenuImage
);

router.get(
  "/menu-image/store/:store_id",
  menuImageController.getMenuImagesByStore
);

module.exports = router;

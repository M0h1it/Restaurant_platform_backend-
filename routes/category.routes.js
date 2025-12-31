const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

// CRUD routes
router.post("/category", categoryController.addCategory);
router.get("/category/store/:store_id", categoryController.getCategoriesByStore);
router.get("/category/:id", categoryController.getCategoryById);
router.put("/category/:id", categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);

module.exports = router;

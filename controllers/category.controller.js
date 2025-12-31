const db = require("../config/db");

/**
 * ADD CATEGORY
 */
exports.addCategory = async (req, res) => {
  const { store_id, category_name, description } = req.body;

  if (!store_id || !category_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO store_categories 
       (store_id, category_name, description)
       VALUES (?, ?, ?)`,
      [store_id, category_name, description]
    );

    res.status(201).json({
      message: "Category added successfully ✅",
      category_id: result.insertId
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "Category already exists for this store" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to add category" });
  }
};

/**
 * GET CATEGORIES BY STORE
 */
exports.getCategoriesByStore = async (req, res) => {
  const { store_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM store_categories
       WHERE store_id = ? AND status = 1
       ORDER BY category_name ASC`,
      [store_id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

/**
 * GET SINGLE CATEGORY
 */
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM store_categories WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

/**
 * UPDATE CATEGORY
 */
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name, description, status } = req.body;

  try {
    await db.query(
      `UPDATE store_categories 
       SET category_name = ?, description = ?, status = ?
       WHERE id = ?`,
      [category_name, description, status, id]
    );

    res.json({ message: "Category updated successfully ✅" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

/**
 * DELETE CATEGORY
 */
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      "DELETE FROM store_categories WHERE id = ?",
      [id]
    );

    res.json({ message: "Category deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

const db = require("../config/db");

/**
 * ADD MENU ITEM
 */
exports.addMenuItem = async (req, res) => {
  const {
    store_id,
    category_id,
    item_name,
    price,
    description,
    secondary_description,
    food_type
  } = req.body;

  const image = req.file ? req.file.filename : null;

  if (!store_id || !category_id || !item_name || !price || !food_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO store_menu_items
      (store_id, category_id, item_name, price, description, secondary_description, food_type, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        store_id,
        category_id,
        item_name,
        price,
        description,
        secondary_description,
        food_type,
        image
      ]
    );

    res.status(201).json({
      message: "Menu item added successfully ✅",
      item_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add menu item" });
  }
};

/**
 * GET MENU ITEMS BY CATEGORY
 */
exports.getMenuItemsByCategory = async (req, res) => {
  const { category_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM store_menu_items
       WHERE category_id = ? AND status = 1
       ORDER BY item_name`,
      [category_id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

/**
 * GET MENU ITEMS BY STORE
 */
exports.getMenuItemsByStore = async (req, res) => {
  const { store_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT mi.*, c.category_name
       FROM store_menu_items mi
       JOIN store_categories c ON c.id = mi.category_id
       WHERE mi.store_id = ?`,
      [store_id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

/**
 * UPDATE MENU ITEM
 */
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const {
    item_name,
    price,
    description,
    secondary_description,
    food_type,
    status
  } = req.body;

  const image = req.file ? req.file.filename : null;

  let query = `
    UPDATE store_menu_items SET
      item_name = ?,
      price = ?,
      description = ?,
      secondary_description = ?,
      food_type = ?,
      status = ?`;

  let params = [
    item_name,
    price,
    description,
    secondary_description,
    food_type,
    status
  ];

  if (image) {
    query += ", image = ?";
    params.push(image);
  }

  query += " WHERE id = ?";
  params.push(id);

  try {
    await db.query(query, params);
    res.json({ message: "Menu item updated successfully ✅" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update menu item" });
  }
};

/**
 * DELETE MENU ITEM
 */
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM store_menu_items WHERE id = ?", [id]);
    res.json({ message: "Menu item deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
};

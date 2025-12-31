const db = require("../config/db");
const fs = require("fs");
const path = require("path");

/**
 * ADD MENU IMAGE
 */
exports.addMenuImage = async (req, res) => {
  const { store_id, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!store_id || !image) {
    return res.status(400).json({ error: "Store ID and image required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO store_menu_images (store_id, category_id, image)
       VALUES (?, ?, ?)`,
      [store_id, category_id || null, image]
    );

    res.status(201).json({
      message: "Menu image uploaded ✅",
      image_id: result.insertId,
      image_url: `/uploads/menu-images/${image}`
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
};

/**
 * UPDATE MENU IMAGE
 */
exports.updateMenuImage = async (req, res) => {
  const { id } = req.params;
  const image = req.file ? req.file.filename : null;

  if (!image) {
    return res.status(400).json({ error: "Image required" });
  }

  try {
    const [[old]] = await db.query(
      "SELECT image FROM store_menu_images WHERE id = ?",
      [id]
    );

    if (!old) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete old image
    const oldPath = path.join("uploads/menu-images", old.image);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

    await db.query(
      "UPDATE store_menu_images SET image = ? WHERE id = ?",
      [image, id]
    );

    res.json({
      message: "Menu image updated ✅",
      image_url: `/uploads/menu-images/${image}`
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update image" });
  }
};

/**
 * DELETE MENU IMAGE
 */
exports.deleteMenuImage = async (req, res) => {
  const { id } = req.params;

  try {
    const [[row]] = await db.query(
      "SELECT image FROM store_menu_images WHERE id = ?",
      [id]
    );

    if (!row) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imagePath = path.join("uploads/menu-images", row.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await db.query(
      "DELETE FROM store_menu_images WHERE id = ?",
      [id]
    );

    res.json({ message: "Menu image deleted ❌" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
};

/**
 * GET MENU IMAGES BY STORE
 */
exports.getMenuImagesByStore = async (req, res) => {
  const { store_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM store_menu_images
       WHERE store_id = ? AND status = 1`,
      [store_id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

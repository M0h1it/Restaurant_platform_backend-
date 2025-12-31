const db = require("../config/db");

/**
 * ADD FLOOR
 */
exports.addFloor = async (req, res) => {
  const { store_id, floor_name, floor_number, description } = req.body;

  if (!store_id || !floor_name || floor_number === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO store_floors 
       (store_id, floor_name, floor_number, description)
       VALUES (?, ?, ?, ?)`,
      [store_id, floor_name, floor_number, description]
    );

    res.status(201).json({
      message: "Floor added successfully ✅",
      floor_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add floor" });
  }
};

/**
 * GET FLOORS BY STORE
 */
exports.getFloors = async (req, res) => {
  const { store_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM store_floors 
       WHERE store_id = ? AND status = 1
       ORDER BY floor_number ASC`,
      [store_id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch floors" });
  }
};

/**
 * GET SINGLE FLOOR
 */
exports.getFloorById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM store_floors WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Floor not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch floor" });
  }
};

/**
 * UPDATE FLOOR
 */
exports.updateFloor = async (req, res) => {
  const { id } = req.params;
  const { floor_name, floor_number, description, status } = req.body;

  try {
    await db.query(
      `UPDATE store_floors 
       SET floor_name = ?, floor_number = ?, description = ?, status = ?
       WHERE id = ?`,
      [floor_name, floor_number, description, status, id]
    );

    res.json({ message: "Floor updated successfully ✅" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update floor" });
  }
};

/**
 * DELETE FLOOR
 */
exports.deleteFloor = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM store_floors WHERE id = ?", [id]);
    res.json({ message: "Floor deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete floor" });
  }
};

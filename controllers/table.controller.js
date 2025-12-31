const db = require("../config/db");

/**
 * ADD TABLE
 */
exports.addTable = async (req, res) => {
  const { store_id, floor_id, table_number, total_seats } = req.body;

  if (!store_id || !floor_id || !table_number || !total_seats) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO floor_tables 
       (store_id, floor_id, table_number, total_seats)
       VALUES (?, ?, ?, ?)`,
      [store_id, floor_id, table_number, total_seats]
    );

    res.status(201).json({
      message: "Table added successfully ✅",
      table_id: result.insertId
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Table number already exists on this floor" });
    }
    res.status(500).json({ error: "Failed to add table" });
  }
};

/**
 * GET TABLES BY FLOOR
 */
exports.getTablesByFloor = async (req, res) => {
  const { floor_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM floor_tables 
       WHERE floor_id = ? AND status = 1
       ORDER BY table_number ASC`,
      [floor_id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tables" });
  }
};

/**
 * GET SINGLE TABLE
 */
exports.getTableById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM floor_tables WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Table not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch table" });
  }
};

/**
 * UPDATE TABLE
 */
exports.updateTable = async (req, res) => {
  const { id } = req.params;
  const { table_number, total_seats, status } = req.body;

  try {
    await db.query(
      `UPDATE floor_tables 
       SET table_number = ?, total_seats = ?, status = ?
       WHERE id = ?`,
      [table_number, total_seats, status, id]
    );

    res.json({ message: "Table updated successfully ✅" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update table" });
  }
};

/**
 * DELETE TABLE
 */
exports.deleteTable = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      "DELETE FROM floor_tables WHERE id = ?",
      [id]
    );

    res.json({ message: "Table deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete table" });
  }
};


/**
 * GET ALL TABLES FLOOR-WISE BY STORE
 */
exports.getTablesFloorWise = async (req, res) => {
  const { store_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT 
         sf.id AS floor_id,
         sf.floor_name,
         sf.floor_number,
         ft.id AS table_id,
         ft.table_number,
         ft.total_seats,
         ft.status
       FROM store_floors sf
       LEFT JOIN floor_tables ft 
         ON ft.floor_id = sf.id AND ft.status = 1
       WHERE sf.store_id = ? AND sf.status = 1
       ORDER BY sf.floor_number ASC, ft.table_number ASC`,
      [store_id]
    );

    // group by floor
    const floors = {};
    rows.forEach(row => {
      if (!floors[row.floor_id]) {
        floors[row.floor_id] = {
          floor_id: row.floor_id,
          floor_name: row.floor_name,
          floor_number: row.floor_number,
          tables: []
        };
      }

      if (row.table_id) {
        floors[row.floor_id].tables.push({
          table_id: row.table_id,
          table_number: row.table_number,
          total_seats: row.total_seats,
          status: row.status
        });
      }
    });

    res.json(Object.values(floors));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch floor-wise tables" });
  }
};

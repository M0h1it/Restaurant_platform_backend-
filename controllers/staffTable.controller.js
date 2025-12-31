const db = require("../config/db");

/**
 * ASSIGN MULTIPLE TABLES TO STAFF
 */
exports.assignTablesToStaff = async (req, res) => {
  const { store_id, staff_id, table_ids } = req.body;

  if (!store_id || !staff_id || !Array.isArray(table_ids)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    // remove old assignments (UPDATE scenario)
    await db.query(
      "DELETE FROM staff_table_assignments WHERE staff_id = ?",
      [staff_id]
    );

    // prepare bulk insert
    const values = table_ids.map(table_id => [
      store_id,
      staff_id,
      table_id
    ]);

    if (values.length > 0) {
      await db.query(
        `INSERT INTO staff_table_assignments 
         (store_id, staff_id, table_id) VALUES ?`,
        [values]
      );
    }

    res.json({ message: "Tables assigned successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign tables" });
  }
};

/**
 * GET TABLES ASSIGNED TO STAFF
 */
exports.getTablesByStaff = async (req, res) => {
  const { staff_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT 
         fta.id,
         ft.id AS table_id,
         ft.table_number,
         ft.total_seats,
         sf.floor_name
       FROM staff_table_assignments fta
       JOIN floor_tables ft ON ft.id = fta.table_id
       JOIN store_floors sf ON sf.id = ft.floor_id
       WHERE fta.staff_id = ?
       ORDER BY sf.floor_number, ft.table_number`,
      [staff_id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assigned tables" });
  }
};

/**
 * REMOVE SINGLE TABLE ASSIGNMENT
 */
exports.removeTableFromStaff = async (req, res) => {
  const { staff_id, table_id } = req.params;

  try {
    await db.query(
      `DELETE FROM staff_table_assignments 
       WHERE staff_id = ? AND table_id = ?`,
      [staff_id, table_id]
    );

    res.json({ message: "Table unassigned successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: "Failed to unassign table" });
  }
};

const db = require("../config/db");

// ADD STORE
exports.createStore = async (req, res) => {
  const {
    store_name,
    owner_name,
    email,
    phone,
    address,
    city,
    state,
    pincode
  } = req.body;

  if (!store_name) {
    return res.status(400).json({ error: "Store name is required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO store_details 
      (store_name, owner_name, email, phone, address, city, state, pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        store_name,
        owner_name,
        email,
        phone,
        address,
        city,
        state,
        pincode
      ]
    );

    res.status(201).json({
      message: "Store added successfully ✅",
      store_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add store" });
  }
};

// GET ALL STORES
exports.getStores = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM store_details ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stores" });
  }
};

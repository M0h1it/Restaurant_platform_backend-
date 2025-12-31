require("dotenv").config();
const express = require("express");

const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173",
    "https://restaurant-platform-backend.vercel.app/api/auth/login"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Store Management API running");
});

// ROUTES
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/store.routes"));
app.use("/api", require("./routes/floor.routes"));
app.use("/api", require("./routes/table.routes"));
app.use("/api", require("./routes/staffTable.routes"));
app.use("/api", require("./routes/category.routes"));
app.use("/api", require("./routes/menuItem.routes"));
app.use("/uploads", express.static("uploads"));
app.use("/api", require("./routes/menuImage.routes"));
app.use("/uploads", express.static("uploads"));
app.use("/api", require("./routes/role.routes"));
app.use("/api", require("./routes/permission.routes"));
app.use("/api", require("./routes/rolePermission.routes"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

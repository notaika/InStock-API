require("dotenv").config();
const express = require("express");
const cors = require("cors");
const warehouseRoutes = require("./routes/warehouse");
const inventoryRoutes = require("./routes/inventory");

const { PORT } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req, res) => {
  res.send("Landed on the server");
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

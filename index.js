require("dotenv").config();
const express = require("express");
const cors = require("cors");
const warehouseRoutes = require("./routes/warehouse");

const { PORT } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/warehouses", warehouseRoutes);

app.get("/", (req, res) => {
  res.send("Landed on the server");
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

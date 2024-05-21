require("dotenv").config();
const express =require("express");
const cors = require("cors");
const mainRoutes = require("./routes/main")

const { PORT } = process.env;
const app= express();

app.use(cors());

app.use(express.json())

app.use("/", mainRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
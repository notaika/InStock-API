const knex = require('knex')(require('../knexfile'));
const express = require("express");
const warehouseController = require("../controllers/warehouse-controller");
const router = express.Router();

router.get("/", (req,res)=>{
    res.json("at get homepage content")
})

router.route("/api/warehouses/:id").get(warehouseController.getWarehouse);

module.exports = router;
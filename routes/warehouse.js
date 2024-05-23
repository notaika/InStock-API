const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouse-controller");
const fs = require('fs');

router.route('/')
    .get(warehouseController.getWarehouses)

router.route("/:id")
    .get(warehouseController.getWarehouse)
    .delete(warehouseController.deleteWarehouse)
    .put(warehouseController.editWarehouse)

module.exports = router;

const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory-controller");
const fs = require('fs');


router.route("/:id")
    .get(inventoryController.getInventory)

module.exports = router;
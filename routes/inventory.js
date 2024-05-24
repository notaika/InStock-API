const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory-controller");
const fs = require('fs');


router.route("/:id")
    .get(inventoryController.getInventory)
    .delete(inventoryController.deleteInventory)
    .put(inventoryController.editInventoryItem)

module.exports = router;
const express = require("express");
const router = express.Router();
const inventoriesController = require("../controllers/inventories-controller");
const fs = require('fs');

router.route('/')
    .get(inventoriesController.getInventories)
    .post(inventoriesController.addInventoryItem);


router.route("/:id")
    .get(inventoriesController.getInventory)
    .delete(inventoriesController.deleteInventory)
    .put(inventoriesController.editInventoryItem);

module.exports = router;

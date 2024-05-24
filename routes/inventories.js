const express = require("express");
const router = express.Router();
const inventoriesController = require("../controllers/inventories-controller");
const fs = require('fs');

router.route('/')
    .get(inventoriesController.getInventories)

router.route("/:id")
    .get(inventoriesController.getInventory)
    .delete(inventoriesController.deleteInventory)

module.exports = router;

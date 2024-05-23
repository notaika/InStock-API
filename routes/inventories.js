const express = require("express");
const router = express.Router();
const inventoriesController = require("../controllers/inventories-controller");
const fs = require('fs');

router.route('/')
    .get(inventoriesController.getInventories)

module.exports = router;

const express = require("express");
const router = express.Router();
const fs = require('fs');

router.get("/", (_req, res) => {
    try {
        const warehouseData = JSON.parse(fs.readFileSync('./data/sample.json'));
        res.status(200).json(warehouseData);
    } catch(error) {
        console.error(error);
        res.status(500).send(`ERROR: Could not retrieve warehouses`, error);
    }
});

module.exports = router;

const express = require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    res.json("at get homepage content")
})

module.exports = router;

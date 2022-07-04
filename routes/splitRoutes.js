const express = require("express");

const {split} = require("../controller/splitController");

const router = express.Router();

router.post("/compute", split);



module.exports = router;
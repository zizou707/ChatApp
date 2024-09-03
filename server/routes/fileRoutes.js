const express = require("express");
const { upload } = require("../upload");
const { postFile, getFiles } = require("../Controllers/fileController");

const router = express.Router();

router.post("/", upload.single("file"), postFile);

router.get("/files", getFiles);

module.exports = router;

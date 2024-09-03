const expressHandler = require("express-async-handler");
const File = require("../models/fileSchema");

const postFile = expressHandler(async (req, res) => {
  try {
    if (!req.file) {
      
      return res.status(500).json({ error: "No file selected" });
    }

    const file = new File({
      fileName: req.file.filename,
      filePath: req.file.path,
    });
    const saveFile = await file.save();

    res.status(200).json(saveFile);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload" });
  }
});

const getFiles = async (req, res) => {
  try {
    const response = await File.find();
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error);
  }
};

module.exports = { postFile, getFiles };

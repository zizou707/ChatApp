const express = require("express");
const {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} = require("../Controllers/messageController");

const router = express.Router();

router.post("/", sendMessage);

router.put("/:messageId", editMessage);

router.get("/:chatId", getMessages);

router.delete("/:messageId", deleteMessage);

module.exports = router;

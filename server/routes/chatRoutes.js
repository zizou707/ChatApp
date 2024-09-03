const express = require("express");
const {
  createChat,
  findUserChats,
  findChat,
} = require("../Controllers/chatController");

const router = express.Router();

router.post("/", createChat);

router.get("/:user_Id", findUserChats);

router.get("/:senderId/:receiverId", findChat);

module.exports = router;

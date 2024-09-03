const Chat = require("../models/chatSchema");
const User = require("../models/userSchema");

// create chat

const createChat = async (req, res) => {
  const { senderId, recieverId } = req.body;

  try {
    const chat = await Chat.findOne({
      members: { $all: [senderId, recieverId] },
    });
    if (chat) return res.status(200).json(chat);

    const newChat = new Chat({
      members: [senderId, recieverId],
    });

    const response = await newChat.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(501).json(error);
  }
};

// find all UserChats for 1 User

const findUserChats = async (req, res) => {
  const userId = req.params.user_Id;

  try {
    const chats = await Chat.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json(error);
  }
};

// find chat for 2 users

const findChat = async (req, res) => {
  const { senderId, recieverId } = req.params;

  try {
    const chat = await Chat.findOne({
      members: { $all: [senderId, recieverId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { createChat, findUserChats, findChat };

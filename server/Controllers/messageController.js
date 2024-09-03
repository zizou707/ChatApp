const { response } = require("express");
const Message = require("../models/messageSchema");

// send message

const sendMessage = async (req, res) => {
  const {
    chatId,
    senderId,
    authorName,
    receiverId,
    messageText,
    imageUrl,
    videoUrl,
  } = req.body;

  const message = new Message({
    chatId,
    senderId,
    authorName,
    receiverId,
    messageText,
    imageUrl,
    videoUrl,
  });

  try {
    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get messages

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete message

const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  try {
    const messages = await Message.findByIdAndDelete(messageId);
    res.status(200).json(messages);
    console.log(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Edit a message

const editMessage = async (req, res) => {
  const { messageId } = req.params;
  const {
    chatId,
    senderId,
    authorName,
    receiverId,
    messageText,
    imageUrl,
    videoUrl,
  } = req.body;

  const message = Message.findByIdAndUpdate(messageId, {
    chatId,
    senderId,
    authorName,
    receiverId,
    messageText,
    imageUrl,
    videoUrl,
  });

  try {
    const response = await message.updateOne();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { sendMessage, getMessages, deleteMessage, editMessage };

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: String,
    senderId: { type: String, required: true },
    authorName: String,
    receiverId: { type: String, required: true },
    messageText: String,
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);

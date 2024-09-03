const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:3000" });

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("onlineUsers", onlineUsers);

  // listen to a connection
  socket.on("addNewUser", (userName, userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userName,
        userId,
        socketId: socket.id,
      });
    console.log("onlineUsers : ", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  // add message and notifications
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((u) => u.userId === message.receiverId);

    // emitting message and notification to this specific user
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        chatId: message.chatId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        message: message.messageText,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3030);

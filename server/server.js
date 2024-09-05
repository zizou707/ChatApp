const express = require("express");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
//const notificationRoutes = require('./routes/notificationRoutes')
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const path = require("node:path");

const app = express();

const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());
app.use(express.static("./client/Assets"));

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  next();
});

// routes

app.use("/upload", fileRoutes);
app.use("/users", userRoutes);
app.use("/users/chats", chatRoutes);
app.use("/users/messages", messageRoutes);
//app.use('/users/notifications',notificationRoutes)

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

mongoose.connect(process.env.MONGO_URI);

var server = createServer(app)

server.listen(PORT, () =>
  console.log(`Connected to DB & server is running at port : ${PORT}`)
)

const io = new Server(server,{ cors: "http://localhost:3000/" })

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

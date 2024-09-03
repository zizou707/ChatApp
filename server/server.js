const express = require("express");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
//const notificationRoutes = require('./routes/notificationRoutes')
const { default: mongoose } = require("mongoose");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());
app.use(express.static("./client/Assets"));

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

// connect to db

try {
  mongoose.connect(process.env.MONGO_URI);
  var server = app.listen(PORT, () =>
    console.log(`Connected to DB & server is running at port : ${PORT}`)
  );
} catch (error) {
  console.log(error);
}

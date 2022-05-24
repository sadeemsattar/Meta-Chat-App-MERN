const express = require("express");
const chats = require("../data/data");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const dbConection = require("../config/database");
const chatRoutes = require("../routes/chatRoutes");
const userRoutes = require("../routes/userRoutes");
const messageRoutes = require("../routes/messageRoutes");
const multerRoutes = require("../routes/multerRoutes");
const {
  notFound,
  errorProductionHandler,
} = require("../middleware/errorHandler");

const app = express();
console.log(__dirname);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());

dotenv.config();
dbConection();

app.use(process.env.API, userRoutes);
app.use(process.env.API, chatRoutes);
app.use(process.env.API, messageRoutes);
app.use(process.env.API, multerRoutes);

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (re, res) => {
    res.send("In Running Condition ... ");
  });
}

app.use(notFound);
app.use(errorProductionHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is listen at port  ${PORT} ...`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  // console.log("Conneted to io" + socket.id);

  socket.on("setup", (userData) => {
    // console.log(userData);
    socket.join(userData._id);
    socket.emit("connected");
  });

  // socket.emit("me", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnd");
  });

  socket.on("pickCall", (data) => {
    io.to(data.to).emit("pickCall", data.signal);
  });

  socket.on("callUser", (call) => {
    console.log("Call Users", call.from, call.name, call.userToCall);
    if (!call.userToCall) return console.log("Call users not defined");

    call.userToCall.forEach((user) => {
      if (user._id == call.from) return;
      io.to(user._id).emit("callUser", {
        signal: call.signalData,
        from: call.from,
        name: call.name,
      });
    });
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User join Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    // console.log(newMessageRecieved);
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("Chat users not defined");

    // socket
    //   .to(newMessageRecieved.chat._id)
    //   .emit("message Recieved", newMessageRecieved);
    chat.users.forEach((user) => {
      if (user == newMessageRecieved.sender._id) return;
      socket.in(user).emit("message Recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnect");
    socket.leave(userData._id);
  });
});

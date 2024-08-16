import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
  },
});

const userSocketMap = {}; // This map stores the socket id corresponding to the userId; userId => socketId

export const getRecieverSocketId = (recieverId) => {
  return userSocketMap[recieverId];
}

//Events of socket.io
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      console.log(
        `User Disconnected: UserId:${userId}, SocketId: ${socket.id}`
      );
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };

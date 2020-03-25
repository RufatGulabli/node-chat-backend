import express from "express";
import HTTP from "http";
import socketio from "socket.io";
import { addUser, removeUser, getAvailableRooms } from "./users";
import User from "./User";
const PORT = 6600;

const app = express();

const server = new HTTP.Server(app);
const io = socketio(server);

io.on("connection", (socket: any) => {
  io.emit("available_rooms", getAvailableRooms());
  socket.on("join", (data: any, callback: any) => {
    const user: User | any = addUser(socket.id, data.name, data.room);
    if (user instanceof Error) {
      console.log(user.message);
      callback(user.message, null);
    }
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, Welcome to ${user.room} room.`
    });
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined to the room.`
    });
    socket.join(data.room);
    io.emit("available_rooms", getAvailableRooms());
    callback(null);
  });

  socket.on("message", (data: any) => {
    io.to(data.room).emit("message", {
      user: data.user,
      text: data.message
    });
  });

  socket.on("forceDisconnect", () => {
    const user = removeUser(socket.id);
    io.emit("available_rooms", getAvailableRooms());
    if (user) {
      io.to(user.room).emit("messages", {
        user: "admin",
        text: `${user.name} has left the room.`
      });
    }
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, function() {
  console.log(`Server is running on port ${PORT}`);
});

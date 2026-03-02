import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import AuthenticationError from "../errors/AuthenticationError.js";

let io;

// Object để map giữa userId và socketId (giúp gửi tin nhắn chính xác cho từng người)
const userSockets = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware xác thực socket bằng JWT
  io.use((socket, next) => {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new AuthenticationError("No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = decoded.id; // Gán userId vào socket để sử dụng sau này
      next();
    } catch (err) {
      next(new AuthenticationError("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `>>> Một user đã kết nối: ${socket.userId} (SocketID: ${socket.id})`
    );

    // Lưu socketId của user vào Map
    userSockets.set(socket.userId, socket.id);

    // Tham gia vào phòng riêng của chính mình để nhận thông báo cá nhân
    socket.join(socket.userId);

    // Xử lý khi user ngắt kết nối
    socket.on("disconnect", () => {
      console.log(`>>> User đã ngắt kết nối: ${socket.userId}`);
      userSockets.delete(socket.userId);
    });
  });

  return io;
};

// Hàm helper để gửi sự kiện đến một user cụ thể (dùng trong controller/service)
export const emitToUser = (userId, event, data) => {
  if (io) {
    // Gửi đến room có tên là userId
    io.to(userId).emit(event, data);
  }
};

export const emitMessageUpdate = (userId, chatId, message) => {
  emitToUser(userId, "message_updated", { 
    chatId, 
    message: typeof message.toJSON === 'function' ? message.toJSON() : message 
  });
};

export const emitMessageDelete = (userId, chatId, messageId) => {
  emitToUser(userId, "message_deleted", { chatId, messageId });
};

export const getIO = () => io;

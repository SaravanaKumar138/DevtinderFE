import { io } from "socket.io-client";

import { url } from "./constants";
import { useSelector } from "react-redux";

const createSocketConnection = (userId) => {

  if (!userId) {
    console.warn("⚠️ Socket not connected: userId missing");
    return null;
  }

  return io(url, {
    withCredentials: true,
    auth: {
      userId, // 🔑 THIS FIXES YOUR ONLINE ISSUE
    },
  });
};

export default createSocketConnection;

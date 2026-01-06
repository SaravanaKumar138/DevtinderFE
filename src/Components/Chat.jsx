// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import createSocketConnection from "../utils/socket";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { url } from "../utils/constants";

// const Chat = () => {
//   const { targetUserId } = useParams();
//   const location = useLocation();
//   const targetUserFirstName = location.state?.connection?.firstName || "User";

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const user = useSelector((store) => store.user);
//   const userId = user?._id;
//   const firstName = user?.firstName;
//   const messagesEndRef = useRef(null);

//   const socketRef = useRef(null); // Socket reference

//   // Fetch initial messages
//   const fetchChatMessages = async () => {
//     try {
//       const chat = await axios.get(`${url}/chat/${targetUserId}`, {
//         withCredentials: true,
//       });
//       const chatMessages = chat?.data?.messages.map((msg) => ({
//         senderUserId: msg?.senderId?._id,
//         firstName: msg?.senderId?.firstName,
//         lastName: msg?.senderId?.lastName,
//         text: msg.text,
//         timestamp: new Date(msg?.createdAt).toTimeString().split(" ")[0],
//       }));
//       setMessages(chatMessages);
//     } catch (err) {
//       console.error("Failed to fetch chat messages:", err);
//     }
//   };

//   // Send message
//   const sendMessage = () => {
//     if (!newMessage.trim() || !socketRef.current) return;

//     const now = new Date();
//     const newOptimisticMessage = {
//       senderUserId: userId,
//       firstName,
//       text: newMessage,
//       timestamp: now.toTimeString().split(" ")[0],
//       isOptimistic: true,
//     };

//     setMessages((prev) => [...prev, newOptimisticMessage]);

//     // Emit message using the same socket
//     socketRef.current.emit("sendMessage", {
//       firstName,
//       userId,
//       targetUserId,
//       text: newMessage,
//       timestamp: now.toISOString(),
//     });

//     setNewMessage("");
//   };

//   // Scroll to the latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Initialize socket connection
//   useEffect(() => {
//     if (!userId) return;

//     socketRef.current = createSocketConnection();
//     const socket = socketRef.current;

//     socket.emit("joinChat", { firstName, userId, targetUserId });

//     socket.on(
//       "messageRecieved",
//       ({ senderUserId, firstName, text, timestamp }) => {
//         if (senderUserId === userId) return; // Ignore own messages

//         const formattedTimestamp = new Date(timestamp)
//           .toTimeString()
//           .split(" ")[0];
//         setMessages((prev) => [
//           ...prev,
//           { senderUserId, firstName, text, timestamp: formattedTimestamp },
//         ]);
//       }
//     );

//     return () => {
//       socket.disconnect();
//     };
//   }, [userId, targetUserId]);

//   // Fetch messages on target user change
//   useEffect(() => {
//     fetchChatMessages();
//   }, [targetUserId]);

//   // Handle Enter key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       sendMessage();
//     }
//   };

//   return (
//     <div className="w-full md:w-3/5 lg:w-1/2 mx-auto my-5 h-[80vh] flex flex-col bg-gray-900 rounded-xl shadow-2xl">
//       {/* Chat Header */}
//       <div className="p-4 border-b border-gray-700 bg-gray-800 rounded-t-xl">
//         <h1 className="text-xl font-bold text-white">
//           Chat with {targetUserFirstName}
//         </h1>
//       </div>

//       {/* Message Area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
//         {messages.map((message, index) => {
//           const isSender = message.senderUserId === userId;

//           return (
//             <div
//               key={index}
//               className={`flex ${isSender ? "justify-end" : "justify-start"}`}
//             >
//               <div className="max-w-[70%] lg:max-w-[50%]">
//                 <div
//                   className={`flex items-baseline mb-1 ${
//                     isSender ? "flex-row-reverse" : "flex-row"
//                   }`}
//                 >
//                   <span
//                     className={`text-xs font-semibold ${
//                       isSender ? "text-pink-400 mr-2" : "text-blue-400 ml-2"
//                     }`}
//                   >
//                     {message.firstName}
//                   </span>
//                   <time className="text-xs opacity-60 text-gray-400">
//                     {message.timestamp}
//                   </time>
//                 </div>

//                 <div
//                   className={`px-4 py-2 rounded-xl text-white shadow-md ${
//                     isSender
//                       ? "bg-pink-600 rounded-tr-none"
//                       : "bg-gray-700 rounded-tl-none"
//                   }`}
//                 >
//                   {message.text}
//                 </div>

//                 <div
//                   className={`text-xs opacity-50 text-gray-500 mt-1 ${
//                     isSender ? "text-right" : "text-left"
//                   }`}
//                 >
//                   {isSender && <span>Seen</span>}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="p-4 border-t border-gray-700 flex items-center gap-3 bg-gray-800 rounded-b-xl">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           className="flex-1 p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition duration-150"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={handleKeyPress}
//         />
//         <button
//           className="btn bg-pink-600 hover:bg-pink-700 border-none text-white font-semibold py-3 px-6 rounded-lg transition duration-150 shadow-lg"
//           onClick={sendMessage}
//           disabled={!newMessage.trim()}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
const socketIO = require("socket.io");
const Chat = require("../models/chat");
const { redisClient } = require("../config/redis");

const ONLINE_TTL = 60; // seconds
const LAST_SEEN_TTL = 86400; // 24 hours

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", async (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (!userId) return socket.disconnect();

    /* ---------------- USER ONLINE ---------------- */
    await redisClient.setEx(`online:user:${userId}`, ONLINE_TTL, Date.now());

    io.emit("userPresence", {
      userId,
      online: true,
    });

    /* ---------------- HEARTBEAT ---------------- */
    socket.on("heartbeat", async () => {
      await redisClient.expire(`online:user:${userId}`, ONLINE_TTL);
    });

    /* ---------------- CHECK USER PRESENCE ---------------- */
    socket.on("checkUserOnline", async ({ targetUserId }) => {
      const isOnline = await redisClient.exists(`online:user:${targetUserId}`);

      let lastSeen = null;
      if (!isOnline) {
        lastSeen = await redisClient.get(`lastseen:user:${targetUserId}`);
      }

      socket.emit("userPresence", {
        userId: targetUserId,
        online: Boolean(isOnline),
        lastSeen,
      });
    });

    /* ---------------- JOIN CHAT ---------------- */
    socket.on("joinChat", ({ targetUserId }) => {
      const room = [userId, targetUserId].sort().join("_");
      socket.join(room);
    });

    /* ---------------- SEND MESSAGE ---------------- */
    socket.on("sendMessage", async ({ targetUserId, text, firstName }) => {
      const roomId = [userId, targetUserId].sort().join("_");

      let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] },
      });

      if (!chat) {
        chat = new Chat({
          participants: [userId, targetUserId],
          messages: [],
        });
      }

      chat.messages.push({ senderId: userId, text });
      await chat.save();

      socket.to(roomId).emit("messageRecieved", {
        senderUserId: userId,
        firstName,
        text,
        timestamp: new Date().toISOString(),
      });
    });

    /* ---------------- DISCONNECT ---------------- */
    socket.on("disconnect", async () => {
      await redisClient.del(`online:user:${userId}`);
      await redisClient.setEx(
        `lastseen:user:${userId}`,
        LAST_SEEN_TTL,
        Date.now()
      );

      io.emit("userPresence", {
        userId,
        online: false,
        lastSeen: Date.now(),
      });
    });
  });
};

module.exports = initializeSocket;

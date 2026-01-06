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
import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import createSocketConnection from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { url } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const location = useLocation();
  const targetUserFirstName = location.state?.connection?.firstName || "User";

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTargetOnline, setIsTargetOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const firstName = user?.firstName;

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* ---------------- FETCH CHAT HISTORY ---------------- */
  const fetchChatMessages = async () => {
    const res = await axios.get(`${url}/chat/${targetUserId}`, {
      withCredentials: true,
    });

    const msgs = res.data.messages.map((msg) => ({
      senderUserId: msg.senderId._id,
      firstName: msg.senderId.firstName,
      text: msg.text,
      timestamp: new Date(msg.createdAt).toTimeString().split(" ")[0],
    }));

    setMessages(msgs);
  };

  /* ---------------- FORMAT LAST SEEN ---------------- */
  const formatLastSeen = (ts) => {
    const diff = Date.now() - ts;
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return "just now";
    if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} hr ago`;
    return `${Math.floor(sec / 86400)} days ago`;
  };

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { targetUserId });

    /* Messages */
    socket.on("messageRecieved", (msg) => {
      if (msg.senderUserId === userId) return;
      setMessages((prev) => [
        ...prev,
        {
          senderUserId: msg.senderUserId,
          firstName: msg.firstName,
          text: msg.text,
          timestamp: new Date(msg.timestamp).toTimeString().split(" ")[0],
        },
      ]);
    });

    /* Presence */
    const handlePresence = ({ userId, online, lastSeen }) => {
      if (userId !== targetUserId) return;

      setIsTargetOnline(online);
      if (online) setLastSeen(null);
      else if (lastSeen) setLastSeen(Number(lastSeen));
    };

    socket.on("userPresence", handlePresence);

    /* Heartbeat */
    const heartbeat = setInterval(() => socket.emit("heartbeat"), 30000);

    /* Presence polling (safety net) */
    const presenceCheck = setInterval(
      () => socket.emit("checkUserOnline", { targetUserId }),
      20000
    );

    socket.emit("checkUserOnline", { targetUserId });

    return () => {
      clearInterval(heartbeat);
      clearInterval(presenceCheck);
      socket.off("userPresence", handlePresence);
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const now = new Date();
    setMessages((prev) => [
      ...prev,
      {
        senderUserId: userId,
        firstName,
        text: newMessage,
        timestamp: now.toTimeString().split(" ")[0],
      },
    ]);

    socketRef.current.emit("sendMessage", {
      targetUserId,
      text: newMessage,
      firstName,
    });

    setNewMessage("");
  };

  /* ---------------- SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
        {/* HEADER */}
        <div className="p-5 border-b border-white/10 bg-black/30">
          <h1 className="text-xl font-bold text-indigo-400">
            💬 Chat with {targetUserFirstName}
          </h1>
          <div className="text-sm text-gray-300 flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isTargetOnline ? "bg-green-400" : "bg-gray-400"
              }`}
            />
            {isTargetOnline
              ? "Online"
              : lastSeen
              ? `Last seen ${formatLastSeen(lastSeen)}`
              : "Offline"}
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.senderUserId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-[70%]">
                <div className="text-xs text-gray-400 mb-1">
                  {m.firstName} • {m.timestamp}
                </div>
                <div className="px-4 py-3 rounded-xl bg-white/10 text-white">
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-white/10 flex gap-3 bg-black/30">
          <input
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 rounded-xl bg-indigo-500 text-white"
          >
            Send 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import createSocketConnection from "../utils/socket";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { url } from "../utils/constants";

// const Chat = () => {
//   const { targetUserId } = useParams();
//   const [newMessage, setNewMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [isTargetOnline, setIsTargetOnline] = useState(false);
//   const socketRef = useRef(null);

//   const user = useSelector((store) => store.user);
//   const loggedInUserId = user?._id;

//   const fetchChats = async () => {
//     try {
//       const chat = await axios.get(url + `/chat/${targetUserId}`, {
//         withCredentials: true,
//       });
//       const chatMessages = chat?.data?.messages.map((msg) => ({
//         senderId: msg.senderId._id,
//         firstName: msg.senderId.firstName,
//         lastName: msg.senderId.lastName,
//         text: msg.text,
//       }));
//       setMessages(chatMessages);
//     } catch (err) {
//       console.error("Error fetching chats:", err);
//     }
//   };

//   useEffect(() => {
//     if (!loggedInUserId) return;
//     fetchChats();
//   }, [loggedInUserId, targetUserId]);

//   useEffect(() => {
//     if (!loggedInUserId) return;

//     // 1. Initialize Connection
//     const socket = createSocketConnection(loggedInUserId);
//     socketRef.current = socket;

//     // 2. HEARTBEAT LOGIC
//     // Send a heartbeat every 25 seconds (must be less than Backend's 60s timeout)
//     const heartbeatTimer = setInterval(() => {
//       if (socket.connected) {
//         socket.emit("heartbeat");
//       }
//     }, 25000);

//     socket.emit("joinChat", {
//       loggedInUserId,
//       targetUserId,
//     });

//     // 3. LISTENERS
//     socket.on("targetUserStatus", ({ userId, status }) => {
//       if (userId === targetUserId) {
//         setIsTargetOnline(status === "online");
//       }
//     });

//     socket.on("userStatusUpdate", ({ userId, status }) => {
//       if (userId === targetUserId) {
//         setIsTargetOnline(status === "online");
//       }
//     });

//     socket.on("messageReceived", ({ senderId, firstName, lastName, text }) => {
//       if (senderId === loggedInUserId) return;
//       setMessages((prev) => [...prev, { senderId, firstName, lastName, text }]);
//     });

//     // 4. CLEANUP
//     return () => {
//       clearInterval(heartbeatTimer); // Stop sending heartbeats
//       socket.disconnect(); // Tell server we are leaving
//     };
//   }, [loggedInUserId, targetUserId]);

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;

//     setMessages((prev) => [
//       ...prev,
//       {
//         senderId: loggedInUserId,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         text: newMessage,
//       },
//     ]);

//     socketRef.current.emit("sendMessage", {
//       firstName: user.firstName,
//       lastName: user.lastName,
//       loggedInUserId,
//       targetUserId,
//       text: newMessage,
//     });

//     setNewMessage("");
//   };

//   return (
//     <div className="w-1/2 m-auto mt-10 border border-gray-600 h-[70vh] flex flex-col bg-base-100 rounded-xl overflow-hidden shadow-xl">
//       {/* HEADER WITH ONLINE STATUS */}
//       <div className="border-b border-gray-600 p-4 flex justify-between items-center bg-base-200">
//         <h1 className="font-bold text-lg">Chat</h1>
//         <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
//           <div
//             className={`w-3 h-3 rounded-full animate-pulse ${
//               isTargetOnline
//                 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
//                 : "bg-gray-400"
//             }`}
//           ></div>
//           <span className="text-sm font-medium">
//             {isTargetOnline ? "Online" : "Offline"}
//           </span>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-5">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={
//               message.senderId === loggedInUserId
//                 ? "chat chat-end"
//                 : "chat chat-start"
//             }
//           >
//             <div className="chat-header">
//               {message.firstName} {message.lastName}
//             </div>
//             <div
//               className={`chat-bubble ${message.senderId === loggedInUserId ? "chat-bubble-secondary" : "chat-bubble-primary"}`}
//             >
//               {message.text}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="p-5 flex gap-2 border-t border-gray-600 bg-base-200">
//         <input
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Type a message..."
//           className="flex-1 h-12 border-2 border-gray-600 rounded-lg p-3 focus:outline-none focus:border-indigo-500 bg-base-100"
//         />
//         <button
//           onClick={sendMessage}
//           className="px-6 h-12 font-bold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 active:scale-95 transition-all"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import createSocketConnection from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { url } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTargetOnline, setIsTargetOnline] = useState(false);

  // --- INFINITE SCROLL STATES ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  // ------------------------------

  const socketRef = useRef(null);
  const user = useSelector((store) => store.user);
  const loggedInUserId = user?._id;

  const fetchChats = async (pageNum, isInitial = false) => {
    if (isLoading || (!hasMore && !isInitial)) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${url}/chat/${targetUserId}?page=${pageNum}&limit=20`,
        { withCredentials: true },
      );

      const fetchedMessages = res.data.messages.map((msg) => ({
        senderId: msg.senderId._id,
        firstName: msg.senderId.firstName,
        lastName: msg.senderId.lastName,
        text: msg.text,
      }));

      // Capture scroll height before updating state to prevent "jumping"
      const scrollContainer = scrollRef.current;
      const previousScrollHeight = scrollContainer?.scrollHeight || 0;

      setMessages((prev) =>
        isInitial ? fetchedMessages : [...fetchedMessages, ...prev],
      );
      setHasMore(res.data.hasMore);

      // Handle Scroll Positioning
      setTimeout(() => {
        if (isInitial) {
          // First load: scroll to bottom
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else {
          // Loading more: maintain position relative to the message the user was looking at
          scrollContainer.scrollTop =
            scrollContainer.scrollHeight - previousScrollHeight;
        }
      }, 0);
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Initial Load: Reset everything when switching users
  useEffect(() => {
    if (!loggedInUserId) return;
    setPage(1);
    setHasMore(true);
    setMessages([]);
    fetchChats(1, true);
  }, [targetUserId, loggedInUserId]);

  // 2. Scroll Listener: Detect when user hits the top
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    // If we are at the top (scrollTop 0) and there are more messages to load
    if (container.scrollTop === 0 && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchChats(nextPage);
    }
  };

  // 3. Socket Connection & Heartbeat (Same logic as before)
  useEffect(() => {
    if (!loggedInUserId) return;

    const socket = createSocketConnection(loggedInUserId);
    socketRef.current = socket;

    const heartbeatTimer = setInterval(() => {
      if (socket.connected) socket.emit("heartbeat");
    }, 25000);

    socket.emit("joinChat", { loggedInUserId, targetUserId });

    socket.on("targetUserStatus", ({ userId, status }) => {
      if (userId === targetUserId) setIsTargetOnline(status === "online");
    });

    socket.on("userStatusUpdate", ({ userId, status }) => {
      if (userId === targetUserId) setIsTargetOnline(status === "online");
    });

    socket.on("messageReceived", (msg) => {
      if (msg.senderId === loggedInUserId) return;
      setMessages((prev) => [...prev, msg]);

      // Auto-scroll to bottom on new message
      setTimeout(() => {
        if (scrollRef.current)
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 50);
    });

    return () => {
      clearInterval(heartbeatTimer);
      socket.disconnect();
    };
  }, [loggedInUserId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msgData = {
      senderId: loggedInUserId,
      firstName: user.firstName,
      lastName: user.lastName,
      text: newMessage,
    };

    setMessages((prev) => [...prev, msgData]);

    socketRef.current.emit("sendMessage", {
      ...msgData,
      loggedInUserId,
      targetUserId,
    });

    setNewMessage("");

    // Scroll to bottom after sending
    setTimeout(() => {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 50);
  };

  return (
    <div className="w-1/2 m-auto mt-10 border border-gray-600 h-[70vh] flex flex-col bg-base-100 rounded-xl overflow-hidden shadow-xl">
      {/* HEADER */}
      <div className="border-b border-gray-600 p-4 flex justify-between items-center bg-base-200">
        <h1 className="font-bold text-lg">Chat</h1>
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
          <div
            className={`w-3 h-3 rounded-full animate-pulse ${isTargetOnline ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-400"}`}
          ></div>
          <span className="text-sm font-medium">
            {isTargetOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* MESSAGES BODY */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-5"
      >
        {/* Loading Indicator at Top */}
        {isLoading && (
          <div className="flex justify-center mb-4">
            <span className="loading loading-dots loading-sm text-gray-400"></span>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.senderId === loggedInUserId
                ? "chat chat-end"
                : "chat chat-start"
            }
          >
            <div className="chat-header">
              {message.firstName} {message.lastName}
            </div>
            <div
              className={`chat-bubble ${message.senderId === loggedInUserId ? "chat-bubble-secondary" : "chat-bubble-primary"}`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-5 flex gap-2 border-t border-gray-600 bg-base-200">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 h-12 border-2 border-gray-600 rounded-lg p-3 focus:outline-none focus:border-indigo-500 bg-base-100"
        />
        <button
          onClick={sendMessage}
          className="px-6 h-12 font-bold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 active:scale-95 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
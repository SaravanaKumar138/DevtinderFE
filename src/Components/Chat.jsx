import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import createSocketConnection from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { url } from "../utils/constants";

const formatLastSeen = (dateString) => {
  if (!dateString) return "a while ago";
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  const diffInMins = Math.floor(diffInMs / 60000);

  if (diffInMins < 1) return "just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`;
  return past.toLocaleDateString();
};

const Chat = () => {
  const { targetUserId } = useParams();
  const location = useLocation();
  const targetUserFirstName = location.state?.connection?.firstName || "User";

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const firstName = user?.firstName;

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* 1. Fetch History & Status */
  useEffect(() => {
    if (!targetUserId) return;

    const fetchData = async () => {
      try {
        const chatRes = await axios.get(`${url}/chat/${targetUserId}`, {
          withCredentials: true,
        });
        const formatted = chatRes.data.messages.map((msg) => ({
          senderUserId: msg.senderId?._id || msg.senderId,
          text: msg.text,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setMessages(formatted);

        const statusRes = await axios.get(`${url}/chat/status/${targetUserId}`);
        setIsOnline(statusRes.data.status === "online");
        setLastSeen(statusRes.data.lastSeen);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };

    fetchData();
  }, [targetUserId]);

  /* 2. Socket logic */
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId });

    // Listen for messages
    socket.on("messageRecieved", (msg) => {
      // Check if message is from the user we are currently talking to
      if (msg.senderUserId === targetUserId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Listen for status changes
    socket.on(
      "userStatus",
      ({ userId: incomingUserId, status, lastSeen: time }) => {
        if (incomingUserId === targetUserId) {
          setIsOnline(status === "online");
          setLastSeen(time);
        }
      },
    );

    return () => {
      socket.off("messageRecieved");
      socket.off("userStatus");
      // Don't disconnect here if you want the user to stay online while browsing other pages
      // socket.disconnect();
    };
  }, [userId, targetUserId]);

  /* 3. Heartbeat */
  useEffect(() => {
    const interval = setInterval(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("heartbeat");
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  /* 4. Scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    const messageData = {
      senderUserId: userId,
      firstName,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Update local UI
    setMessages((prev) => [...prev, messageData]);

    // Emit to server
    socketRef.current.emit("sendMessage", {
      userId,
      targetUserId,
      firstName,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="max-w-xl mx-auto h-[80vh] flex flex-col bg-gray-900 rounded-xl shadow-lg border border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-t-xl border-b border-gray-700">
        <div>
          <h2 className="text-white font-semibold">{targetUserFirstName}</h2>
          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`}
            ></span>
            <span className="text-xs text-gray-400">
              {isOnline ? "Online" : `Last seen ${formatLastSeen(lastSeen)}`}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.map((msg, idx) => {
          const isMe = msg.senderUserId === userId;
          return (
            <div
              key={idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-md ${isMe ? "bg-pink-600 text-white rounded-br-none" : "bg-gray-700 text-white rounded-bl-none"}`}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] opacity-60 mt-1 text-right">
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 p-3 bg-gray-800 rounded-b-xl border-t border-gray-700">
        <input
          className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="px-5 py-2 bg-pink-600 hover:bg-pink-700 transition-colors rounded-lg text-white font-medium"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

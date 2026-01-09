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
  const [isOnline, setIsOnline] = useState(false);

  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const firstName = user?.firstName;

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* ------------------ Fetch chat history ------------------ */
  useEffect(() => {
    if (!targetUserId) return;

    const fetchChat = async () => {
      const res = await axios.get(`${url}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      const formatted = res.data.messages.map((msg) => ({
        senderUserId: msg.senderId?._id,
        firstName: msg.senderId?.firstName,
        text: msg.text,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setMessages(formatted);
    };

    fetchChat();
  }, [targetUserId]);

  /* ------------------ Socket connection ------------------ */
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageRecieved", (msg) => {
      if (msg.senderUserId === userId) return;
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("userStatus", ({ userId: uid, status }) => {
      if (uid === targetUserId) {
        setIsOnline(status === "online");
      }
    });

    return () => {
      socket.off("messageRecieved");
      socket.off("userStatus");
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  /* ------------------ Heartbeat ------------------ */
  useEffect(() => {
    if (!socketRef.current || !userId) return;

    const interval = setInterval(() => {
      socketRef.current.emit("heartbeat");
    }, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  /* ------------------ Initial online status ------------------ */
  useEffect(() => {
    if (!targetUserId) return;

    const fetchStatus = async () => {
      const res = await axios.get(`${url}/chat/status/${targetUserId}`);
      setIsOnline(res.data.status === "online");
    };

    fetchStatus();
  }, [targetUserId]);

  /* ------------------ Scroll ------------------ */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ------------------ Send message ------------------ */
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      senderUserId: userId,
      firstName,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, message]);

    socketRef.current.emit("sendMessage", {
      userId,
      targetUserId,
      firstName,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="max-w-xl mx-auto h-[80vh] flex flex-col bg-gray-900 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-t-xl">
        <h2 className="text-white font-semibold">{targetUserFirstName}</h2>
        <span
          className={`text-xs font-medium ${
            isOnline ? "text-green-400" : "text-gray-400"
          }`}
        >
          ● {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => {
          const isMe = msg.senderUserId === userId;
          return (
            <div
              key={idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
                  isMe
                    ? "bg-pink-600 text-white rounded-br-none"
                    : "bg-gray-700 text-white rounded-bl-none"
                }`}
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

      {/* Input */}
      <div className="flex gap-2 p-3 bg-gray-800 rounded-b-xl">
        <input
          className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white outline-none"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="px-5 py-2 bg-pink-600 rounded-lg text-white font-medium"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

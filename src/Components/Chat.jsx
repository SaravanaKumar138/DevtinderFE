import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Added useLocation to get connection name
import createSocketConnection from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { url } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  // Use useLocation to get the connection details passed from ConnectionCard
  const location = useLocation();
  const targetUserFirstName = location.state?.connection?.firstName || "User";

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const firstName = user?.firstName;
  const messagesEndRef = useRef(null);

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(url + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      console.log(chat?.data?.messages);
      const chatMessages = chat?.data?.messages.map((msg) => {
        return {
          senderUserId: msg?.senderId?._id,
          firstName: msg?.senderId?.firstName,
          lastName: msg?.senderId?.lastName,
          text: msg.text,
          // Format the timestamp to HH:MM:SS
          timestamp: new Date(msg?.createdAt).toTimeString().split(" ")[0],
        };
      });
      setMessages(chatMessages);
    } catch (err) {
      console.error("Failed to fetch chat messages:", err);
    }
  };

  const sendMesage = () => {
    if (!newMessage.trim()) return; // Prevent sending empty messages
    const socket = createSocketConnection();
    const now = new Date();

    // Optimistically add the message to the UI before receiving confirmation
    const newOptimisticMessage = {
      senderUserId: userId,
      firstName: firstName,
      text: newMessage,
      timestamp: now.toTimeString().split(" ")[0],
      isOptimistic: true, // Marker for styling (optional)
    };
    setMessages((prev) => [...prev, newOptimisticMessage]);

    socket.emit("sendMessage", {
      firstName,
      userId,
      targetUserId,
      text: newMessage,
      // You might want to send the client-side timestamp as well
      timestamp: now.toISOString(),
    });
    setNewMessage("");
  };

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch initial messages
  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  // Handle socket connection and incoming messages
  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { firstName, userId, targetUserId });

    socket.on("messageRecieved", ({ firstName, text, timestamp }) => {
       if (senderId === userId) return;
      console.log(firstName + " " + text);
      const formattedTimestamp = new Date(timestamp)
        .toTimeString()
        .split(" ")[0];
      setMessages((prev) => [
        ...prev,
        {
          firstName,
          text,
          timestamp: formattedTimestamp,
          senderUserId: targetUserId,
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMesage();
    }
  };

  return (
    <div className="w-full md:w-3/5 lg:w-1/2 mx-auto my-5 h-[80vh] flex flex-col bg-gray-900 rounded-xl shadow-2xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 rounded-t-xl">
        <h1 className="text-xl font-bold text-white">
          Chat with {targetUserFirstName}
        </h1>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message, index) => {
          const isSender = message.senderUserId === userId;

          return (
            <div
              key={index}
              // Use Tailwind classes to position the bubble based on sender
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] lg:max-w-[50%]`}>
                {/* Chat Header: Name and Time */}
                <div
                  className={`flex items-baseline mb-1 ${
                    isSender ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold ${
                      isSender ? "text-pink-400 mr-2" : "text-blue-400 ml-2"
                    }`}
                  >
                    {message.firstName}
                  </span>
                  <time className="text-xs opacity-60 text-gray-400">
                    {message.timestamp}
                  </time>
                </div>

                {/* Chat Bubble */}
                <div
                  className={`px-4 py-2 rounded-xl text-white shadow-md ${
                    isSender
                      ? "bg-pink-600 rounded-tr-none" // Your message: Pink/Purple, rounded on left
                      : "bg-gray-700 rounded-tl-none" // Their message: Darker gray, rounded on right
                  }`}
                >
                  {message.text}
                </div>

                {/* Chat Footer: Seen */}
                <div
                  className={`text-xs opacity-50 text-gray-500 mt-1 ${
                    isSender ? "text-right" : "text-left"
                  }`}
                >
                  {/* Note: Real 'Seen' logic requires more backend work, keeping it here for UI */}
                  {isSender && <span>Seen</span>}
                </div>
              </div>
            </div>
          );
        })}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 flex items-center gap-3 bg-gray-800 rounded-b-xl">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition duration-150"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="btn bg-pink-600 hover:bg-pink-700 border-none text-white font-semibold py-3 px-6 rounded-lg transition duration-150 shadow-lg"
          onClick={sendMesage}
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

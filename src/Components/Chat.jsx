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
  const socketRef = useRef(null);

  const user = useSelector((store) => store.user);
  const loggedInUserId = user?._id;
  const fetchChats = async () => {
    const chat = await axios.get(url+`/chat/${targetUserId}`, {
      withCredentials: true
    });
    console.log(chat.data.messages);
    const chatMessages = chat?.data?.messages.map(msg => {
      return {senderId: msg.senderId._id, firstName: msg.senderId.firstName, lastName: msg.senderId.lastName, text: msg.text}
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    if (!loggedInUserId) return;
    fetchChats();
  }, [loggedInUserId, targetUserId]);

  useEffect(() => {
    if (!loggedInUserId) return;

    socketRef.current = createSocketConnection(loggedInUserId);

    socketRef.current.emit("joinChat", {
      loggedInUserId,
      targetUserId,
    });

     socketRef.current.on("targetUserStatus", ({ userId, status }) => {
       if (userId === targetUserId) {
         setIsTargetOnline(status === "online");
       }
     });

         socketRef.current.on("userStatusUpdate", ({ userId, status }) => {
           if (userId === targetUserId) {
             setIsTargetOnline(status === "online");
           }
         });


    socketRef.current.on("messageReceived", ({ senderId, firstName, lastName, text }) => {
      // ❌ Ignore messages sent by me (already added optimistically)
      if (senderId === loggedInUserId) return;
      setMessages((prev) => [...prev, { senderId, firstName, lastName, text }]);
    });

    return () => socketRef.current.disconnect();
  }, [loggedInUserId, targetUserId]);

const sendMessage = () => {
  if (!newMessage.trim()) return;

  setMessages((prev) => [
    ...prev,
    {
      senderId: loggedInUserId,
      firstName: user.firstName,
      lastName: user.lastName,
      text: newMessage,
    },
  ]);

  socketRef.current.emit("sendMessage", {
    firstName: user.firstName,
    lastName: user.lastName,
    loggedInUserId,
    targetUserId,
    text: newMessage,
  });

  setNewMessage("");
};
  return (
    <div className="w-1/2 m-auto mt-10 border border-gray-600 h-[70vh] flex flex-col">
      <h1 className="border border-gray-600 p-2 m-2">Chat</h1>
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${isTargetOnline ? "bg-green-500" : "bg-gray-400"}`}
        ></div>
        <span className="text-sm">{isTargetOnline ? "Online" : "Offline"}</span>
      </div>

      <div className="flex-1 overflow-scroll p-5">
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
              {message.firstName + " " + message.lastName}
              <time className="text-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble">{message.text}</div>
          </div>
        ))}
      </div>

      <div className="m-5 flex justify-between border-t border-gray-600">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-2/3 h-10 mt-5 border-2 rounded-md p-2"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 mt-5 font-medium rounded-lg bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400 hover:scale-105 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

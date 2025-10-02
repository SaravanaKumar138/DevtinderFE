import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import createSocketConnection from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { url } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  const user = useSelector((store) => store.user);

  const userId = user?._id;

  const firstName = user?.firstName;

  const messagesEndRef = useRef(null);

  const fetchChatMessages = async () => {
    const chat = await axios.get(url+"/chat/"+targetUserId, {
      withCredentials: true
    });
    console.log(chat?.data?.messages);
    const chatMessages = chat?.data?.messages.map((msg) => {
      return {
        senderUserId: msg?.senderId?._id,
        firstName: msg?.senderId?.firstName,
        lastName: msg?.senderId?.lastName,
        text: msg.text,
        timestamp: new Date(msg?.createdAt).toISOString().split("T")[1].split(".")[0]
      }
  });
  setMessages(chatMessages);
};

   const sendMesage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
     setNewMessage("");
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    fetchChatMessages();
  }, []);
  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { firstName, userId, targetUserId }); //as soon as the page loads the socket connection is made and emitting an event joinChat
    socket.on("messageRecieved", ({firstName, text, timestamp}) => {//recieving the message from server
      console.log(firstName+" "+text);
      setMessages((prev) => [...prev, {firstName, text, timestamp}]);
     
    })
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);
  return (
    <div className="w-1/2 mx-auto m-5 h-[70vh] flex flex-col border border-gray-600">
      <h1 className="p-5 border-b border-gray-600 ">Chat</h1>
      <div className="flex-1 overflow-scroll p-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat ${
              message.senderUserId === userId ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-header">
              {message.firstName}
              <time className="text-xs opacity-50">{message.timestamp}</time>
            </div>
            <div className="chat-bubble">{message.text}</div>
            <div className="chat-footer opacity-50">Seen</div>
            <div ref={messagesEndRef} />
          </div>
        ))}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-500 p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={sendMesage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

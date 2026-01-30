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

      const scrollContainer = scrollRef.current;
      const previousScrollHeight = scrollContainer?.scrollHeight || 0;

      setMessages((prev) =>
        isInitial ? fetchedMessages : [...fetchedMessages, ...prev],
      );
      setHasMore(res.data.hasMore);

      setTimeout(() => {
        if (isInitial) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else {
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

  useEffect(() => {
    if (!loggedInUserId) return;
    setPage(1);
    setHasMore(true);
    setMessages([]);
    fetchChats(1, true);
  }, [targetUserId, loggedInUserId]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    if (container.scrollTop === 0 && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchChats(nextPage);
    }
  };

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
    setTimeout(() => {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 50);
  };

  return (
    <div className="flex justify-center pt-10">
      {/* MAIN CONTAINER: Matches the card style of DevTinder */}
      <div className="w-full max-w-2xl h-[75vh] flex flex-col bg-[#2a244d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="p-4 px-6 flex justify-between items-center bg-white/5 border-b border-white/10">
          <h1 className="text-xl font-bold text-white tracking-wide">Chat</h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-full">
            <div
              className={`w-2 h-2 rounded-full ${isTargetOnline ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-gray-500"}`}
            ></div>
            <span className="text-xs font-medium text-white/70 uppercase">
              {isTargetOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {isLoading && (
            <div className="flex justify-center pb-2">
              <span className="loading loading-dots loading-sm text-purple-400"></span>
            </div>
          )}

          {messages.map((message, index) => {
            const isMe = message.senderId === loggedInUserId;
            return (
              <div
                key={index}
                className={`chat ${isMe ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-header text-white/40 text-xs mb-1">
                  {message.firstName}
                </div>
                <div
                  className={`chat-bubble py-3 px-4 rounded-2xl max-w-xs shadow-md ${
                    isMe
                      ? "bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] text-white"
                      : "bg-[#3b3561] text-white border border-white/5"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT AREA */}
        <div className="p-4 px-6 bg-white/5 border-t border-white/10 flex gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 h-12 bg-[#1a1633] border border-white/10 text-white rounded-xl px-4 focus:outline-none focus:border-purple-500 placeholder:text-white/20"
          />
          <button
            onClick={sendMessage}
            className="px-8 h-12 font-bold rounded-xl text-white shadow-lg transition-transform active:scale-95 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default Chat;

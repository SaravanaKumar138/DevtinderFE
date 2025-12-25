import React, { useEffect } from "react";
import { url } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import ConnectionCard from "./ConnectionCard";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(url + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error("Failed to fetch connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <h1 className="text-3xl text-gray-300 font-semibold">
          🤝 No connections yet
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
        Your Connections
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {connections.map((connection) => (
          <ConnectionCard key={connection._id} connection={connection}  />
        ))}
      </div>
    </div>
  );
};

export default Connections;

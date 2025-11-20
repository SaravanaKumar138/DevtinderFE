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
      console.log(res?.data?.data);
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      // It's generally better to handle the error here, perhaps logging it or setting an error state
      console.error("Failed to fetch connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0)
    return (
      <h1 className="flex justify-center m-10 text-xl text-gray-400">
        No connections found
      </h1>
    );

  return (
    <div className="p-4">
      {/* Enhanced Heading: Centered, large, bold, and bright white text */}
      <h1 className="text-4xl font-extrabold text-white text-center my-8">
        Connections
      </h1>
      <div className="space-y-4">
        {" "}
        {/* Add some vertical spacing between cards */}
        {connections.map((connection) => (
          <ConnectionCard key={connection._id} connection={connection} />
        ))}
      </div>
    </div>
  );
};

export default Connections;

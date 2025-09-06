import React, { useEffect } from "react";
import { url } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import ConnectionCard from "./ConnectionCard";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector(store => store.connections);
  const fetchConnections = async () => {
    try {
      const res = await axios.get(url + "/user/connections", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addConnections(res?.data?.data));
    } catch (err) {}
  };
  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length == 0) return <h1>No connections found</h1>
  return <div>
    <h1 className="flex justify-center m-5 text-2xl font-bold ">Connections</h1>
    {
      connections.map(connection => (
        <ConnectionCard key={connection._id} connection={connection}/>
      ))
    }
  </div>;
};

export default Connections;

import axios from "axios";
import React, { useEffect } from "react";
import { url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";
import RequestCard from "./RequestCard";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);
  console.log(requests);
  const fetchRequest = async () => {
    try {
      const res = await axios.get(url + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequest();
  }, []);
  if (!requests || requests.length == 0)
    return (
      <h1 className="text-3xl md:text-4xl  font-extrabold text-center mb-12 mt-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
        No Connection Request
      </h1>
    );
  return (
    requests && (
      <div className="min-h-screen px-6 py-16 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
           Connection Request
        </h1>
        {requests.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))}
      </div>
    )
  );
};

export default Requests;

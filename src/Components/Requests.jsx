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
      <h1 className="flex justify-center text-2xl font-bold m-5">
        No Connection Request
      </h1>
    );
  return (
    requests && (
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Connection Requests</h1>
        {requests.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))}
      </div>
    )
  );
};

export default Requests;

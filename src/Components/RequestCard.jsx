import axios from "axios";
import React from "react";
import { url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeRequests } from "../utils/requestSlice";

const RequestCard = ({ request }) => {
  console.log(request);
  const { firstName, lastName, age, photoUrl, gender } = request.fromUserId;
  const dispatch = useDispatch();
  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        url + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(_id));
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <h1 className="font-bold text-2xl m-5 flex justify-center">
        Connection Requests
      </h1>
      <div className="flex items-center w-1/2 bg-base-300 mx-auto justify-evenly rounded-xl">
        <div>
          <img src={photoUrl} alt="" className="h-32 w-32 rounded-full m-2" />
        </div>
        <div className="ml-5">
          <h1 className="text-2xl font-semibold">
            {firstName + " " + lastName}
          </h1>
          {gender && (
            <h1 className="text-xl font-semibold">Gender: {gender}</h1>
          )}
          {age && <h1 className="text-xl font-semibold">Age: {age}</h1>}
        </div>
        <div>
          <button
            className="btn btn-primary mx-2 p-5 text-xl"
            onClick={() => reviewRequest("rejected", request._id)}
          >
            Reject
          </button>
          <button
            className="btn btn-secondary p-5 text-xl"
            onClick={() => reviewRequest("accepted", request._id)}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;

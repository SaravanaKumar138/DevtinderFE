import axios from "axios";
import React from "react";
import { url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();
  console.log(user);
  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        url + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeed(userId));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="card bg-base-300 w-96 shadow-sm ">
      <figure>
        <img
          src={photoUrl}
          alt="photo"
          className="m-2 w-96 object-cover rounded-xl"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && <p>Age: {age}</p>}
        {gender && <p>Gender: {gender}</p>}
        {about && <p>About: {about}</p>}
        <div className="card-actions justify-evenly">
          <button
            className="btn btn-primary"
            onClick={() => handleSendRequest("ignored", user._id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest("interested", user._id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

import axios from "axios";
import React from "react";
import { url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const dispatch = useDispatch();
  console.log(user);

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${url}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeed(userId));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div
      className="w-[420px] rounded-2xl overflow-hidden 
  bg-white/5 backdrop-blur-xl 
  border border-white/10 
  shadow-xl hover:shadow-indigo-500/30 
  transition-all duration-300 hover:scale-[1.03]"
    >
      {/* IMAGE */}
      <div className="relative w-full h-[360px] overflow-hidden">
        <img
          src={photoUrl}
          alt="profile"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="p-2 text-white">
        <h2
          className="text-2xl font-bold bg-clip-text text-transparent 
      bg-gradient-to-r from-indigo-400 to-pink-400"
        >
          {firstName} {lastName}
        </h2>
        {about && (
          <p className="mt-3 text-sm text-gray-300 leading-relaxed line-clamp-3">
            {about}
          </p>
        )}

        {/* SKILLS */}
        {skills?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
              Skills
            </p>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-semibold
              bg-indigo-500/20 text-indigo-300 
              border border-indigo-400/30
              hover:bg-indigo-500/30 transition"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-between mt-6 gap-4">
          <button
            className="w-1/2 py-3 rounded-xl 
        bg-red-500/20 text-red-400 
        hover:bg-red-500/30 transition font-semibold"
            onClick={() => handleSendRequest("ignored", user._id)}
          >
            ❌ Ignore
          </button>

          <button
            className="w-1/2 py-3 rounded-xl 
        bg-indigo-500/20 text-indigo-400 
        hover:bg-indigo-500/30 transition font-semibold"
            onClick={() => handleSendRequest("interested", user._id)}
          >
            ❤️ Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

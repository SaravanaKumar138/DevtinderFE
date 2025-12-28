import axios from 'axios';
import React from 'react'
import { url } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeRequests } from '../utils/requestSlice';

const RequestCard = ({request}) => {
  console.log(request);
   const {
     firstName,
     lastName,
     photoUrl,
     role,
     experience, skills
   } = request.fromUserId;
   const fullName = `${firstName || ""} ${lastName || ""}`.trim();
   
   const dispatch = useDispatch();

   const handleRequest = async (status, userId) => {
   try {
     const response = await axios.post(
       `${url}/review/${status}/${userId}`,
       {},
       { withCredentials: true }
     );
     console.log(response.data);
     dispatch(removeRequests(request._id));
   } catch (err) {
     console.error(err.response?.data?.message || err.message);
   }
   }
  return (
    <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02]">
      {/* AVATAR */}
      <div className="shrink-0">
        <img
          src={photoUrl || "https://via.placeholder.com/150"}
          alt={fullName}
          className="h-28 w-28 rounded-full object-cover border-4 border-indigo-400/50"
        />
      </div>

      {/* INFO */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
          {fullName}
        </h2>

        <div className="flex gap-4 text-sm text-gray-300 mt-1">
          {role && <span>💼 {role}</span>}
          {experience !== undefined && <span>🧠 {experience} yrs</span>}
        </div>

        <div>
          {skills &&
            skills.map((s) => (
              <span key={s}
                className="px-3 py-1 mr-2 rounded-full text-xs font-semibold cursor-pointer
        bg-indigo-500/20 text-indigo-300 border border-indigo-400/30
        hover:bg-red-500/20 hover:text-red-400 transition"
              >
                {s}
              </span>
            ))}
        </div>
      </div>
      <div className="flex justify-between mt-6 gap-4">
        <button
          className="w-1/2 py-3 px-2 rounded-xl 
        bg-red-500/20 text-red-400 
        hover:bg-red-600/30 transition font-semibold"
          onClick={() => handleRequest("rejected", request.fromUserId._id)}
        >
          ❌ Reject
        </button>
        <button
          className="w-1/2 py-3 px-2 rounded-xl 
        bg-indigo-500/20 text-indigo-400 
        hover:bg-indigo-600/30 transition font-semibold"
          onClick={() => handleRequest("accepted", request.fromUserId._id)}
        >
          ❤️ Accept
        </button>
      </div>
    </div>
  );
}

export default RequestCard

import React from "react";
import { Link } from "react-router-dom";

const ConnectionCard = ({ connection , showMatching = true}) => {
  const { firstName, lastName, photoUrl, gender, age, about, skills , matchPercentage} = connection;
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();

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
          {age && <span>🎂 {age}</span>}
          {gender && <span>⚧ {gender}</span>}
        </div>
     
        <div>
          {skills &&
            skills.map((s) => (
              <span
                className="px-3 py-1 mr-2 rounded-full text-xs font-semibold cursor-pointer
        bg-indigo-500/20 text-indigo-300 border border-indigo-400/30
        hover:bg-red-500/20 hover:text-red-400 transition"
              >
                {s}
              </span>
            ))}
        </div>
        {about && (
          <p className="mt-3 text-gray-300 text-sm leading-relaxed max-w-xl">
            {about}
          </p>
        )}
      </div>

      {/* ACTION */}
     
      <div className="flex gap-5">
         {showMatching || 
        <h1 className="bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg p-2">
          Matching{" "}
          <p className="ml-5" >
            {matchPercentage} %
          </p>
        </h1>
}
        <Link to={`/chat/${connection._id}`} state={{ connection }}>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:scale-105 transition font-semibold shadow-lg">
            💬 Chat
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ConnectionCard;

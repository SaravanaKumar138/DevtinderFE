import React from "react";
import { Link } from "react-router-dom";

const ConnectionCard = ({
  connection,
  showMatching = true,
  showChatButton = true,
  onReject,
  onRequest,
}) => {
  const {
    firstName,
    lastName,
    photoUrl,
    gender,
    age,
    about,
    skills,
    matchPercentage,
    isPremium,
  } = connection;

  const fullName = `${firstName || ""} ${lastName || ""}`.trim();
  const getSkillName = (skill) =>
    typeof skill === "string" ? skill : skill?.name || "";

  return (
    <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02]">
      <div className="shrink-0">
        <img
          src={photoUrl || "https://via.placeholder.com/150"}
          alt={fullName}
          className="h-28 w-28 rounded-full object-cover border-4 border-indigo-400/50"
        />
      </div>

      <div className="flex-1">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
          {fullName} {isPremium && <span className="ml-2 text-xs">[Premium]</span>}
        </h2>

        <div className="flex gap-4 text-sm text-gray-300 mt-1">
          {age && <span>Age: {age}</span>}
          {gender && <span>Gender: {gender}</span>}
        </div>

        <div>
          {skills &&
            skills.map((s, index) => {
              const skillName = getSkillName(s);
              const skillKey =
                (typeof s === "object" && s?._id) || `${skillName}-${index}`;

              if (!skillName) return null;

              return (
                <span
                  key={skillKey}
                  className="px-3 py-1 mr-2 rounded-full text-xs font-semibold cursor-pointer
        bg-indigo-500/20 text-indigo-300 border border-indigo-400/30
        hover:bg-red-500/20 hover:text-red-400 transition"
                >
                  {skillName}
                </span>
              );
            })}
        </div>

        {about && (
          <p className="mt-3 text-gray-300 text-sm leading-relaxed max-w-xl">
            {about}
          </p>
        )}
      </div>

      <div className="flex gap-5">
        {showMatching || (
          <h1 className="bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg p-2">
            Matching <p className="ml-5">{matchPercentage} %</p>
          </h1>
        )}

        {showChatButton ? (
          <Link to={`/chat/${connection._id}`} state={{ connection }}>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:scale-105 transition font-semibold shadow-lg">
              Chat
            </button>
          </Link>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onReject}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-400/40 hover:bg-red-500/30 transition font-semibold"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={onRequest}
              className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 hover:bg-indigo-500/30 transition font-semibold"
            >
              Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;

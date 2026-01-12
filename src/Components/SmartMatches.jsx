import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../utils/constants";
import { useSelector } from "react-redux";
import ConnectionCard from "./ConnectionCard";

const SmartMatches = () => {
  const userData = useSelector((store) => store.user);
  const [matches, setMatches] = useState([]);

  const skills = userData?.skills || [];
  const experience = userData?.experience;
  const { isPremiumUser } = userData || {};

  const hasSkills = skills.length > 0;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/matches/match`, {
        params: {
          skills: skills.join(","),
          experience,
        },
        withCredentials: true,
      });
      setMatches(res.data.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    // 🔒 Premium + skills required
    if (hasSkills && isPremiumUser) {
      fetchUsers();
    }
  }, [hasSkills, isPremiumUser]);

  // ❌ No skills
  if (!hasSkills) {
    return (
      <div className="text-center mt-10 text-gray-400">
        ❌ No skills added — cannot find matches
      </div>
    );
  }

  // 🔒 Not a premium user → hard block
  if (!isPremiumUser) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center bg-yellow-100 border border-yellow-400 text-yellow-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Premium Feature 🔒</h2>
        <p className="mb-6">
          Smart Matches are available only for Premium users.
        </p>
        <button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600">
          Upgrade to Premium
        </button>
      </div>
    );
  }

  // ✅ Premium user view
  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
        Smart Matches
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {matches.length === 0 ? (
          <p className="text-center text-gray-400">No matches found yet.</p>
        ) : (
          matches.map((user) => (
            <ConnectionCard
              key={user._id}
              connection={user}
              showMatching={false}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SmartMatches;

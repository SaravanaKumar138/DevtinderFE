import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import ConnectionCard from "./ConnectionCard";
import { addUser } from "../utils/userSlice";

const SmartMatches = () => {
  const userData = useSelector((store) => store.user);
  console.log("User Data:", userData);
  const [matches, setMatches] = useState([]);

  const skills = userData?.skills || [];
  const experience = userData?.experience;

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
    if (hasSkills && isPremium) {
      fetchUsers();
    }
  }, [hasSkills, isPremium]);

  // ❌ No skills
  if (!hasSkills) {
    return (
      <div className="text-center mt-10 text-gray-400">
        ❌ No skills added — cannot find matches
      </div>
    );
  }

  // 🔒 Not a premium user → hard block

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

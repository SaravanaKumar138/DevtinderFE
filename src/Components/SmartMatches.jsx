import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../utils/constants";
import { useSelector } from "react-redux";
import UserCard from "./UserCard";
import ConnectionCard from "./ConnectionCard";

const SmartMatches = () => {
  const userData = useSelector((store) => store.user);
  const [matches, setMatches] = useState([]);
  const skills = userData?.skills || [];
  const experience = userData?.experience;

  const hasSkills = skills.length > 0;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/matches/match`, {
        params: {
          skills: skills.join(","), // backend expects query
          experience,
        },
        withCredentials: true,
      });
      console.log(res.data);
      setMatches(res.data.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (hasSkills) {
      fetchUsers(); // ✅ only call when skills exist
    }
  }, [hasSkills]);

  // ❌ No skills → show message
  if (!hasSkills) {
    return (
      <div className="text-center mt-10 text-gray-400">
        ❌ No skills added — cannot find matches
      </div>
    );
  }

  // ✅ Skills present → show page
  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
        Smart Matches
      </h1>
      {/* Matches list will go here */}
      <div className="max-w-5xl mx-auto space-y-6">
        {matches.map((user) => (
          <ConnectionCard connection={user} showMatching={false} />
        ))}
      </div>
    </div>
  );
};

export default SmartMatches;

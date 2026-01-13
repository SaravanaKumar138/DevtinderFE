import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import ConnectionCard from "./ConnectionCard";
import { addUser } from "../utils/userSlice";
import Loading from "./Loading";

const SmartMatches = () => {
  const userData = useSelector((store) => store.user);
  console.log("User Data:", userData);
  const [matches, setMatches] = useState([]);
  const[loading, setLoading] = useState(true);
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
      setLoading(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    // 🔒 Premium + skills required
    if (hasSkills ) {
      fetchUsers();
    }
  }, [hasSkills]);

  // ❌ No skills
  if (!hasSkills) {
    return (
      <div className="text-center mt-10 text-gray-400">
        ❌ No skills added — cannot find matches
      </div>
    );
  }

    if (loading) return <Loading />; 

  // 🔒 Not a premium user → hard block

  // ✅ Premium user view
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent ">
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

import React, { useState } from "react";
import UserCard from "./UserCard";
import { url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [experience, setExperience] = useState(user.experience || 0);
 const [skills, setSkills] = useState(user.skills || []);
 const [skillInput, setSkillInput] = useState("");
 const [role, setRole] = useState(user.role || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [toaster, setToaster] = useState(false);
  const dispatch = useDispatch();


  const addSkill = () => {
    if (!skillInput.trim()) return;

    const newSkill = skillInput.trim();

    if (skills.includes(newSkill)) return; // prevent duplicates

    setSkills([...skills, newSkill]);
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };


  const saveChanges = async () => {

    try {
      
      const res = await axios.patch(
        `${url}/profile/edit`,
        { firstName, lastName, age : Number(age),experience: Number(experience),role, skills, gender, photoUrl, about },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      setToaster(true);
      setTimeout(() => setToaster(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };
  
  return (
    <div className="min-h-screen px-6 py-16 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* TOASTER */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 transition-all duration-500
        ${toaster ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <div className="px-6 py-3 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 shadow-lg">
          ✅ Profile updated successfully
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* EDIT FORM */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
            ✏️ Edit Profile
          </h2>

          {[
            ["First Name", firstName, setFirstName],
            ["Last Name", lastName, setLastName],
            ["Photo URL", photoUrl, setPhotoUrl],
            ["Experience", experience, setExperience],
            ["Role", role, setRole],
            ["skills", skills, setSkills],
            ["Age", age, setAge],
            ["About", about, setAbout],
          ].map(([label, value, setter]) =>
            label === "skills" ? (
              <div className="mb-6">
                <label className="text-sm text-gray-300">🛠 Skills</label>

                <div className="flex gap-2 mt-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Add a skill (e.g. React)"
                    className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-indigo-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 hover:bg-indigo-500/30 transition"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      onClick={() => removeSkill(skill)}
                      className="px-3 py-1 rounded-full text-xs font-semibold cursor-pointer
        bg-indigo-500/20 text-indigo-300 border border-indigo-400/30
        hover:bg-red-500/20 hover:text-red-400 transition"
                    >
                      {skill} ✕
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div key={label} className="mb-4">
                <label className="text-sm text-gray-300">{label}</label>
                <input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="mt-1 w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-indigo-400 outline-none"
                />
                {label === "Age" && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-300">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="mt-1 w-full px-4 py-2 rounded-lg 
               bg-black/40 border border-white/10 
               focus:border-indigo-400 outline-none text-white"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                )}
              </div>
            )
          )}

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

          <button
            onClick={saveChanges}
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:scale-105 transition font-semibold"
          >
            💾 Save Changes
          </button>
        </div>

        {/* LIVE PREVIEW */}
        <div>
          <h3 className="text-center mb-4 text-gray-300">
            👁 Live Profile Preview
          </h3>
          <UserCard
            isPreview
            user={{ firstName, lastName, photoUrl, age, gender, about }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";

const SKILL_OPTIONS = [
  "react",
  "node.js",
  "java",
  "spring boot",
  "mongodb",
  "aws",
];


const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
console.log(user);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [experience, setExperience] = useState(user.experience || 0);
  const [role, setRole] = useState(user.role || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [image, setImage] = useState(null);

  // 🔹 CORE SKILLS
  const [primarySkill, setPrimarySkill] = useState(user.skills?.[0] || "");
  const [secondarySkill, setSecondarySkill] = useState(user.skills?.[1] || "");
  const [tertiarySkill, setTertiarySkill] = useState(user.skills?.[2] || "");

  // 🔹 EXTRA SKILLS
  const [extraSkills, setExtraSkills] = useState(user.skills?.slice(3) || []);
  const [skillInput, setSkillInput] = useState("");

  const [error, setError] = useState("");
  const [toaster, setToaster] = useState(false);

  const addExtraSkill = () => {
    if (!skillInput.trim()) return;
    if (extraSkills.includes(skillInput.trim())) return;
    setExtraSkills([...extraSkills, skillInput.trim()]);
    setSkillInput("");
  };

  const removeExtraSkill = (skill) => {
    setExtraSkills(extraSkills.filter((s) => s !== skill));
  };
const saveChanges = async () => {
  try {
    let uploadedPhotoUrl = photoUrl;

    // 1️⃣ Upload image only if selected
    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await axios.post(
        `${url}/profile/profile-image`,
        formData,
        {
          withCredentials: true,
        }
      );

      // ✅ Safety check
      if (!uploadRes.data?.imageUrl) {
        throw new Error("Image upload failed");
      }

      uploadedPhotoUrl = uploadRes.data.imageUrl;
      setPhotoUrl(uploadedPhotoUrl); // replace blob with CDN URL
      setImage(null);
    }

    // 2️⃣ Update profile (NO photoUrl here)
    const res = await axios.patch(
      `${url}/profile/edit`,
      {
        firstName,
        lastName,
        age: Number(age),
        experience: Number(experience),
        role,
        gender,
        about,
        skills: [
          primarySkill,
          secondarySkill,
          tertiarySkill,
          ...extraSkills,
        ].filter(Boolean),
      },
      { withCredentials: true }
    );

    dispatch(addUser(res.data.data));

    setToaster(true);
    setTimeout(() => setToaster(false), 3000);
  } catch (err) {
    console.error(err);
    setError(
      err?.response?.data?.message || err?.message || "Something went wrong"
    );
  }
};

useEffect(() => {
  if (!user) return;

  setFirstName(user.firstName || "");
  setLastName(user.lastName || "");
  setAge(user.age ?? "");
  setGender(user.gender || "");
  setAbout(user.about || "");

  setExperience(user.experience ?? 0);
  setRole(user.role || "");

  setPrimarySkill(user.skills?.[0] || "");
  setSecondarySkill(user.skills?.[1] || "");
  setTertiarySkill(user.skills?.[2] || "");
  setExtraSkills(user.skills?.slice(3) || []);
  setPhotoUrl(user.photoUrl || "");
}, [user]);


  return (
    <div className="min-h-screen px-6 py-16 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* TOASTER */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 transition-all duration-500
        ${toaster ? "opacity-100 translate-y-0 z-10" : "opacity-0 -translate-y-4"}`}
      >
        <div className="px-6 py-3 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 shadow-lg">
          ✅ Profile updated successfully
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* EDIT FORM */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
            ✏️ Edit Profile
          </h2>

          {[
            ["First Name", firstName, setFirstName],
            ["Last Name", lastName, setLastName],
            ["Experience", experience, setExperience],
            ["Role", role, setRole],
            ["Age", age, setAge],
          ].map(([label, value, setter]) => (
            <div key={label} className="mb-4">
              <label className="text-sm text-gray-300">{label}</label>
              <input
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-indigo-400 outline-none"
              />
            </div>
          ))}
          <label className="text-sm text-gray-300 m-2">Profile Image</label>
          <br />
          <input
            type="file"
            accept="image/*"
            className="mb-4 w-48 text-sm text-white text-center bg-purple-600 px-2 py-2 rounded-md cursor-pointer "
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              const previewUrl = URL.createObjectURL(file);
              setImage(file);
              setPhotoUrl(previewUrl);

              // cleanup previous blob
              return () => URL.revokeObjectURL(previewUrl);
            }}
          />
          {/* GENDER */}
          <div className="mb-4">
            <label className="text-sm text-gray-300">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-indigo-400 outline-none"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* ABOUT */}
          <div className="mb-6">
            <label className="text-sm text-gray-300">About</label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-indigo-400 outline-none"
            />
          </div>

          {/* SKILLS */}
          <div className="mb-6">
            <label className="text-sm text-gray-300 block mb-2">
              🛠 Core Skills (Top 3)
            </label>

            {[
              ["Primary Skill", primarySkill, setPrimarySkill],
              ["Secondary Skill", secondarySkill, setSecondarySkill],
              ["Additional Skill", tertiarySkill, setTertiarySkill],
            ].map(([label, value, setter]) => (
              <select
                key={label}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="mb-3 w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-indigo-400 outline-none"
              >
                <option value="">{label}</option>
                {SKILL_OPTIONS.map((skill) => (
                  <option
                    key={skill}
                    value={skill}
                    disabled={[
                      primarySkill,
                      secondarySkill,
                      tertiarySkill,
                    ].includes(skill)}
                  >
                    {skill}
                  </option>
                ))}
              </select>
            ))}

            {/* EXTRA SKILLS */}
            <label className="text-sm text-gray-400 block mb-1">
              ➕ Other skills (optional)
            </label>

            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addExtraSkill()}
                placeholder="Add extra skill (e.g. Redis)"
                className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-indigo-400 outline-none"
              />
              <button
                type="button"
                onClick={addExtraSkill}
                className="px-4 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 hover:bg-indigo-500/30 transition"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {extraSkills.map((skill) => (
                <span
                  key={skill}
                  onClick={() => removeExtraSkill(skill)}
                  className="px-3 py-1 rounded-full text-xs font-semibold cursor-pointer
                  bg-indigo-500/20 text-indigo-300 border border-indigo-400/30
                  hover:bg-red-500/20 hover:text-red-400 transition"
                >
                  {skill} ✕
                </span>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

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
            user={{ firstName, lastName, photoUrl, age, gender, about , role, experience, skills: [
              primarySkill,
              secondarySkill,
              tertiarySkill,
              ...extraSkills,
            ].filter(Boolean)}}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

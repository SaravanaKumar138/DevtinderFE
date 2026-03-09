import axios from "axios";
import React, { useMemo, useState } from "react";
import { ALL_SKILL_OPTIONS, url } from "../utils/constants";
import { useSelector } from "react-redux";
import ConnectionCard from "./ConnectionCard";
import Loading from "./Loading";

const EXPERIENCE_OPTIONS = [
  { label: "Any", value: "any", min: null, max: null },
  { label: "0-1 years", value: "0-1", min: 0, max: 1 },
  { label: "2-3 years", value: "2-3", min: 2, max: 3 },
  { label: "4-5 years", value: "4-5", min: 4, max: 5 },
  { label: "6+ years", value: "6+", min: 6, max: null },
];

const getSkillName = (skill) =>
  typeof skill === "string" ? skill : skill?.name || "";

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const getExperienceScore = (candidateExperience, selectedRange) => {
  if (!selectedRange || selectedRange.value === "any") return 100;

  const years = Number(candidateExperience ?? 0);
  const { min, max } = selectedRange;

  if (min !== null && years < min) return Math.max(0, 100 - (min - years) * 20);
  if (max !== null && years > max) return Math.max(0, 100 - (years - max) * 20);

  return 100;
};

const SmartMatches = () => {
  const userData = useSelector((store) => store.user);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mySkillNames = useMemo(() => {
    const skills = userData?.skills || [];
    return skills.map((skill) => normalize(getSkillName(skill))).filter(Boolean);
  }, [userData]);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("any");

  const allSkillOptions = useMemo(
    () => [...new Set([...ALL_SKILL_OPTIONS.map(normalize), ...mySkillNames])],
    [mySkillNames]
  );
  const orderedSkillOptions = useMemo(() => {
    const selectedSet = new Set(selectedSkills);
    const selected = allSkillOptions.filter((skill) => selectedSet.has(skill));
    const unselected = allSkillOptions.filter((skill) => !selectedSet.has(skill));
    return [...selected, ...unselected];
  }, [allSkillOptions, selectedSkills]);

  const selectedRange = EXPERIENCE_OPTIONS.find(
    (item) => item.value === selectedExperience
  );

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill]
    );
  };

  const rankedMatches = useMemo(() => {
    return matches
      .map((candidate) => {
        const candidateSkillNames = (candidate?.skills || [])
          .map((skill) => normalize(getSkillName(skill)))
          .filter(Boolean);

        const candidateSkillSet = new Set(candidateSkillNames);

        const sharedCount = selectedSkills.filter((skill) =>
          candidateSkillSet.has(skill)
        ).length;

        const skillMatch =
          (sharedCount / Math.max(selectedSkills.length, 1)) * 100;

        const expMatch = getExperienceScore(candidate?.experience, selectedRange);
        const matchPercentage = Math.round(skillMatch * 0.7 + expMatch * 0.3);

        return { ...candidate, matchPercentage };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [matches, selectedSkills, selectedRange]);

  const findDevelopers = async () => {
    if (selectedSkills.length === 0) {
      setError("Please select at least one skill.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const params = {
        skills: selectedSkills.join(","),
      };

      if (selectedExperience !== "any") {
        params.experienceRange = selectedExperience;
      }
      if (typeof selectedRange?.min === "number") {
        params.minExperience = selectedRange.min;
      }
      if (typeof selectedRange?.max === "number") {
        params.maxExperience = selectedRange.max;
      }

      const res = await axios.get(`${url}/matches/match`, {
        params,
        withCredentials: true,
      });

      setMatches(res.data?.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Could not fetch matches right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${url}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      setMatches((prev) => prev.filter((match) => match._id !== userId));
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Could not send request right now. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-6 py-16 flex flex-col items-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent">
        Smart Matches
      </h1>

      <div className="w-full max-w-5xl bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
        <p className="text-white font-semibold mb-4">Find Developers</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Select skills (multi-select)
            </label>
            <div className="w-full h-28 overflow-y-auto px-3 py-2 rounded-lg bg-black/40 border border-white/10">
              {orderedSkillOptions.map((skill) => (
                <label
                  key={skill}
                  className="flex items-center gap-2 text-white text-sm py-0.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                    className="accent-indigo-500"
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Experience filter
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
            >
              {EXPERIENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={findDevelopers}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-indigo-500/30 text-indigo-100 border border-indigo-300/60 hover:bg-indigo-500/40 transition disabled:opacity-60"
          >
            Find Developers
          </button>
        </div>

        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-1">Selected skills:</p>
          {selectedSkills.length ? (
            <ul className="text-xs text-gray-300 space-y-1">
              {selectedSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">None</p>
          )}
        </div>
      </div>

      {loading && <Loading />}

      {!loading && error && <p className="text-red-300 mb-6">{error}</p>}

      {!loading && !error && (
        <div className="max-w-5xl mx-auto space-y-6 w-full">
          {rankedMatches.length === 0 ? (
            <p className="text-center text-gray-400">No matches found yet.</p>
          ) : (
            rankedMatches.map((user) => (
              <div key={user._id} className="space-y-2">
                <p className="text-sm text-indigo-200">Match: {user.matchPercentage}%</p>
                <ConnectionCard
                  connection={user}
                  showMatching={false}
                  showChatButton={false}
                  onReject={() => handleSendRequest("ignored", user._id)}
                  onRequest={() => handleSendRequest("interested", user._id)}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SmartMatches;

import React from "react";
import {
  FaUsers,
  FaProjectDiagram,
  FaChartLine,
  FaNetworkWired,
} from "react-icons/fa";
import FeatureCard from "./FeatureCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative text-center px-6 pt-24 pb-20">
        {/* glowing background */}
        <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500" />

        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400 animate-pulse">
          Welcome to DevTinder <span className="text-pink-500">❤</span>
        </h1>

        <p className="text-sm md:text-base text-gray-300 mt-4 animate-fade-in">
          Built by developers, for developers 💻
        </p>

        <p className="mt-6 text-lg text-gray-200 animate-bounce">
          🔍 Find your perfect dev match!
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
          {[
            "#FullStackDev",
            "#OpenSource",
            "#ReactJS",
            "#NodeJS",
            "#MongoDB",
            "#MachineLearning",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:scale-110 hover:bg-indigo-500/30 transition"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="px-6 py-20">
        <h2 className="text-center text-3xl font-bold mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
          Why Choose DevTinder?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<FaUsers />}
            title="Match with Developers"
            desc="Find developers who share your tech stack and interests."
          />


          <FeatureCard
            icon={<FaChartLine />}
            title="Skill Growth"
            desc="Learn from peers and enhance your abilities."
          />

          <FeatureCard
            icon={<FaNetworkWired />}
            title="Network Building"
            desc="Build meaningful connections in the tech community."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 via-pink-500/20 to-purple-500/20 blur-2xl" />

        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to find your perfect dev match?
        </h2>

        <p className="text-gray-300 mb-10 max-w-xl mx-auto">
          Join thousands of developers who have already found their ideal
          collaborators.
        </p>

        <button
          onClick={handleGetStarted}
          className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transform hover:scale-110 transition-all duration-300 shadow-xl shadow-pink-500/30"
        >
          🚀 Get Started Now
        </button>
      </section>
    </div>
  );
};

export default Home;

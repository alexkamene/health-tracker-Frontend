"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiAward, FiUsers, FiBarChart, FiZap, FiStar } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COLORS = ["#4C51BF", "#38A169", "#D69E2E", "#E53E3E", "#8B5CF6", "#EC4899"]; // Indigo, Green, Yellow, Red, Purple, Pink

const GamifiedDashboard = () => {
  const [user, setUser] = useState({ username: "", level: 0, xp: 0, streak: 0, badges: [] });
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUser();
    fetchLeaderboard();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) window.location.href = "/login";
      const response = await axios.get("https://heath-tracker-backend.onrender.com/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      toast.success(`Welcome back, ${response.data.username}!`, { position: "top-right" });
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      toast.error("Failed to load your profile.", { position: "top-right" });
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/user/leaderboard");
      setLeaderboard(response.data);
    } catch (error) {
      console.error("❌ Error fetching leaderboard:", error);
      toast.error("Failed to load leaderboard.", { position: "top-right" });
    }
  };

  // Simulate claiming a reward (for interactivity)
  const claimReward = () => {
    toast.info("🎉 Reward claimed! More features coming soon!", { position: "top-right" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-green-100 to-purple-100 p-4 md:p-6 relative overflow-hidden">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="w-80 h-80 bg-indigo-200 rounded-full absolute top-10 left-10 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-green-200 rounded-full absolute bottom-20 right-20 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            <span className="bg-gradient-to-r from-green-500 to-indigo-500 bg-clip-text text-transparent">🏆 Welcome, {user.username}!</span>
          </h1>
          <p className="text-lg mt-2 text-gray-700">Level up your health game with XP, badges, and challenges! 🚀</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User XP & Level */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 animate-slide-in-left">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FiBarChart className="text-yellow-300 text-3xl animate-pulse" />
              <span className="drop-shadow-md">Your Progress</span>
            </h2>
            <div className="mt-4 space-y-3">
              <p className="text-lg"><strong className="text-yellow-200">⚡ Level:</strong> <span className="text-yellow-300 text-xl font-bold">{user.level || 0}</span></p>
              <p className="text-lg"><strong className="text-green-200">🎯 XP:</strong> <span className="text-green-300 text-xl font-bold">{user.xp || 0} XP</span></p>
              <p className="text-lg"><strong className="text-red-200">🔥 Streak:</strong> <span className="text-red-300 text-xl font-bold">{user.streak || 0} Days</span></p>
            </div>
            <div className="mt-6 bg-gray-800 rounded-full h-6 overflow-hidden shadow-inner relative">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-green-400 text-center text-sm font-bold text-gray-900 transition-all duration-1000 ease-in-out"
                style={{ width: `${(user.xp % 100) || 0}%` }}
              >
                {(user.xp % 100) || 0}%
              </div>
            </div>
            <p className="text-sm text-gray-300 mt-3 italic">Next level at <span className="font-bold">{(user.level + 1) * 100} XP</span></p>
            <div className="absolute inset-0 bg-white opacity-5 rounded-2xl blur-lg pointer-events-none"></div>
          </div>

          {/* User Badges */}
          <div className="bg-white p-6 rounded-2xl shadow-xl animate-slide-in-right">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <FiAward className="text-yellow-500 text-2xl" /> Your Achievements
            </h2>
            <div className="flex gap-4 mt-4 flex-wrap">
              {user.badges && user.badges.length > 0 ? (
                user.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg text-center text-white shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer relative group"
                  >
                    <span className="flex items-center gap-1">
                      <FiStar className="text-white" /> {badge.title || "Badge"}
                    </span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                      Earned: {badge.date || "Unknown"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No badges yet—start earning some! 🎖</p>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white p-6 rounded-2xl shadow-xl md:col-span-2 lg:col-span-1 animate-slide-in-left">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <FiUsers className="text-green-500 text-2xl" /> Leaderboard
            </h2>
            {leaderboard.length === 0 ? (
              <p className="text-gray-500 mt-3">No rankings yet—climb the ranks!</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {leaderboard.slice(0, 5).map((player, index) => (
                  <li
                    key={index}
                    className={`p-3 rounded-lg flex justify-between items-center transition-all duration-300 ${
                      player.username === user.username ? "bg-green-100" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600 font-semibold">{index + 1}.</span>
                      <span className="text-lg font-medium text-gray-800">{player.username}</span>
                    </div>
                    <span className="text-sm text-gray-600">🏆 {player.xp} XP (Lv. {player.level})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Reward Claim */}
          <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 rounded-2xl shadow-xl text-white animate-slide-in-right hover:shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiZap className="text-yellow-300 text-2xl animate-pulse" /> Power Up!
            </h2>
            <p className="text-gray-200 mt-2">Claim a reward for your progress!</p>
            <button
              onClick={claimReward}
              className="mt-4 w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105"
            >
              <FiStar /> Claim Reward
            </button>
          </div>

          {/* Progress Stats */}
          <div className="bg-white p-6 rounded-2xl shadow-xl md:col-span-2 animate-slide-in-left">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <FiBarChart className="text-indigo-500 text-2xl" /> Your Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <p className="text-3xl font-bold text-indigo-600">{user.level || 0}</p>
                <p className="text-gray-600">Level</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{user.xp || 0}</p>
                <p className="text-gray-600">XP</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">{user.streak || 0}</p>
                <p className="text-gray-600">Streak Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations and Styles */}
      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes blob {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out; }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .group:hover .group-hover\\:block { display: block; }
      `}</style>
    </div>
  );
};

export default GamifiedDashboard;

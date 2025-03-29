"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiAward, FiUsers, FiBarChart } from "react-icons/fi";

const GamifiedDashboard = () => {
  const [user, setUser] = useState({});
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
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/user/leaderboard");
     
      setLeaderboard(response.data);
    } catch (error) {
      console.error("❌ Error fetching leaderboard:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen text-white">
      {/* 🔥 Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">🏆 Welcome, {user.username}!</h1>
        <p className="text-lg mt-2">Keep going! Earn XP, complete challenges & level up! 🚀</p>
      </div>

      {/* 🎮 User XP & Level */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl shadow-lg text-white mb-6 relative">
        {/* 🏆 Icon & Title */}
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <FiBarChart className="text-yellow-300 text-3xl animate-pulse" />
          <span className="drop-shadow-md">Your Progress</span>
        </h2>

        {/* 🌟 Level & Stats */}
        <div className="mt-4 space-y-2">
          <p className="text-lg"><strong>⚡ Level:</strong> <span className="text-yellow-300 text-xl font-bold">{user.level}</span></p>
          <p className="text-lg"><strong>🎯 XP:</strong> <span className="text-green-300 text-xl font-bold">{user.xp} XP</span></p>
          <p className="text-lg"><strong>🔥 Streak:</strong> <span className="text-red-300 text-xl font-bold">{user.streak} Days</span></p>
        </div>

        {/* 📊 Animated Progress Bar */}
        <div className="mt-6 bg-gray-700 rounded-full h-5 overflow-hidden shadow-inner relative">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-green-400 text-center text-xs font-bold leading-5 text-black transition-all duration-500 ease-in-out"
            style={{ width: `${(user.xp % 100)}%` }}
          >
            {(user.xp % 100)}%
          </div>
        </div>

        {/* 🎯 Next Level Milestone */}
        <p className="text-sm text-gray-300 mt-3 italic">Next level at <span className="font-bold">{user.level * 100} XP</span></p>

        {/* 🎮 Animated Overlay (Extra Coolness) */}
        <div className="absolute inset-0 bg-white opacity-5 rounded-xl blur-lg"></div>
      </div>

      {/* 🏅 User Badges */}
      <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiAward className="text-yellow-500" /> Your Achievements
        </h2>
        <div className="flex gap-4 mt-3 flex-wrap">
          {user.badges && user.badges.length > 0 ? (
            user.badges.map((badge, index) => (

              <div key={index} className="p-3 bg-yellow-100 rounded-lg text-center text-yellow-800 shadow">
                🏅 {badge.title}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No badges yet. Complete challenges to earn some! 🎖</p>
          )}
        </div>
      </div>

      {/* 🏆 Leaderboard */}
      <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiUsers className="text-green-500" /> Leaderboard
        </h2>
        {leaderboard.length === 0 ? (
          <p className="text-gray-500">No rankings yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {leaderboard.map((player, index) => (
              <li key={index} className="p-2 border-b flex justify-between items-center">
                <span className="text-lg font-medium">{index + 1}. {player.username}</span>
                <span className="text-sm text-gray-500">🏆 {player.xp} XP (Level {player.level})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GamifiedDashboard;

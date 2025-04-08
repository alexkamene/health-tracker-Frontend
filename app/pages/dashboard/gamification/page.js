"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiTrophy, FiStar, FiZap, FiTrello } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COLORS = ["#4C51BF", "#38A169", "#D69E2E", "#E53E3E", "#8B5CF6", "#EC4899"]; // Indigo, Green, Yellow, Red, Purple, Pink

const GamificationDashboard = () => {
  const [sleepData, setSleepData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [mentalData, setMentalData] = useState([]);
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [points, setPoints] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [challenges, setChallenges] = useState([
    { id: 1, name: "Sleep Master", goal: 7, current: 0, reward: 30, completed: false },
    { id: 2, name: "Hydration Hero", goal: 2000, current: 0, reward: 20, completed: false },
    { id: 3, name: "Mood Booster", goal: 7, current: 0, reward: 25, completed: false },
  ]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const sleepResponse = await axios.get("https://heath-tracker-backend.onrender.com/sleep/week", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSleepData(sleepResponse.data.reverse());

        const waterResponse = await axios.get("https://heath-tracker-backend.onrender.com/water/week", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWaterData(waterResponse.data.reverse());

        const mentalResponse = await axios.get("https://heath-tracker-backend.onrender.com/mental-wellness/week", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentalData(mentalResponse.data.reverse());

        const profileResponse = await axios.get("https://heath-tracker-backend.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          username: profileResponse.data.username || "Player",
          email: profileResponse.data.email || "player@example.com",
        });

        // Fetch leaderboard
        const leaderboardResponse = await axios.get("https://heath-tracker-backend.onrender.com/user/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaderboard(leaderboardResponse.data);

        // Calculate gamification metrics
        calculateGamification(sleepResponse.data, waterResponse.data, mentalResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load game data!", { position: "top-right" });
      }
    };
    fetchData();
  }, []);

  // Gamification Logic
  const calculateGamification = (sleepData, waterData, mentalData) => {
    let newPoints = 0;
    const newBadges = [];

    // Points: 10 per sleep hour, 5 per 500ml water, 15 per mood entry
    newPoints += sleepData.reduce((sum, d) => sum + (d.duration || 0) * 10, 0);
    newPoints += Math.floor(waterData.reduce((sum, d) => sum + (d.amount || 0), 0) / 500) * 5;
    newPoints += mentalData.length * 15;
    setPoints(newPoints);

    // Badges
    if (sleepData.some((d) => d.duration >= 8)) newBadges.push("Sleep Champion");
    if (waterData.some((d) => d.amount >= 2000)) newBadges.push("Water Warrior");
    if (mentalData.some((d) => d.mood >= 8)) newBadges.push("Mood Master");
    if (newPoints >= 300) newBadges.push("Wellness Wizard");
    setBadges(newBadges);

    // Challenges Progress (today's data)
    const today = new Date().toLocaleDateString();
    const todaySleep = sleepData.filter((d) => new Date(d.date).toLocaleDateString() === today);
    const todayWater = waterData.filter((d) => new Date(d.date).toLocaleDateString() === today);
    const todayMental = mentalData.filter((d) => new Date(d.date).toLocaleDateString() === today);

    setChallenges((prev) =>
      prev.map((challenge) => {
        if (challenge.name === "Sleep Master") {
          const sleep = todaySleep.reduce((sum, d) => sum + (d.duration || 0), 0);
          return { ...challenge, current: sleep, completed: sleep >= challenge.goal };
        }
        if (challenge.name === "Hydration Hero") {
          const water = todayWater.reduce((sum, d) => sum + (d.amount || 0), 0);
          return { ...challenge, current: water, completed: water >= challenge.goal };
        }
        if (challenge.name === "Mood Booster") {
          const mood = todayMental.length > 0 ? todayMental[0].mood : 0;
          return { ...challenge, current: mood, completed: mood >= challenge.goal };
        }
        return challenge;
      })
    );
  };

  // Chart Data Preparation
  const sleepChartData = sleepData.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    sleep: entry.duration || 0,
  }));

  const waterChartData = waterData.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    water: entry.amount || 0,
  }));

  const mentalChartData = mentalData.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    mood: entry.mood || 0,
    stress: entry.stressLevel || 0,
  }));

  const pieData = [
    { name: "Sleep Hours", value: sleepData.reduce((sum, d) => sum + (d.duration || 0), 0) },
    { name: "Water (L)", value: waterData.reduce((sum, d) => sum + (d.amount || 0), 0) / 1000 },
    { name: "Mood Points", value: mentalData.reduce((sum, d) => sum + (d.mood || 0), 0) },
  ].filter((d) => d.value > 0);

  // Progress Calculations
  const totalSleep = sleepData.reduce((sum, d) => sum + (d.duration || 0), 0);
  const totalWater = waterData.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalMood = mentalData.reduce((sum, d) => sum + (d.mood || 0), 0);
  const sleepGoal = sleepData.length * 7; // 7 hours per day
  const waterGoal = waterData.length * 2000; // 2000ml per day
  const moodGoal = mentalData.length * 7; // Mood 7+ per day
  const sleepProgress = Math.min((totalSleep / sleepGoal) * 100, 100);
  const waterProgress = Math.min((totalWater / waterGoal) * 100, 100);
  const moodProgress = Math.min((totalMood / moodGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-green-50 to-purple-50 p-4 md:p-6 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="w-80 h-80 bg-indigo-200 rounded-full absolute top-10 left-10 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-green-200 rounded-full absolute bottom-20 right-20 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 animate-fade-in-down">
          Welcome, <span className="text-indigo-600">{profile.username}</span>! Ready to Conquer?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Player Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">🎮 Your Stats</h2>
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://via.placeholder.com/80"
                alt="Avatar"
                className="w-20 h-20 rounded-full border-4 border-indigo-500"
              />
              <div>
                <p className="text-lg font-semibold text-gray-900">{profile.username}</p>
                <p className="text-gray-600">
                  Points: <span className="text-indigo-600">{points}</span>
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              Level: <span className="font-semibold text-indigo-600">{Math.floor(points / 100)}</span>
            </p>
          </div>

          {/* Points & Badges */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-green-600">🏆 Achievements</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Points: <span className="text-green-600 font-semibold">{points}</span>
              </p>
              <div>
                <p className="text-gray-700 font-semibold">Badges ({badges.length}):</p>
                {badges.length === 0 ? (
                  <p className="text-gray-500">No badges yet—keep it up!</p>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <FiTrello /> {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Challenges */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">⚡ Daily Quests</h2>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-700">{challenge.name}</p>
                    <p className="text-sm text-gray-500">
                      {challenge.current}/{challenge.goal}{" "}
                      {challenge.name.includes("Sleep") ? "hrs" : challenge.name.includes("Hydration") ? "ml" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-purple-500 rounded-full"
                        style={{ width: `${Math.min((challenge.current / challenge.goal) * 100, 100)}%` }}
                      />
                    </div>
                    {challenge.completed && <FiStar className="text-yellow-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sleep Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg md:col-span-2 animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">🛌 Sleep Quest</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sleepChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                <Legend />
                <Line type="monotone" dataKey="sleep" stroke={COLORS[0]} name="Sleep (hrs)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Water Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h2 className="text-xl font-semibold mb-4 text-green-600">💧 Hydration Quest</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={waterChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                <Legend />
                <Bar dataKey="water" fill={COLORS[1]} name="Water (ml)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Mental Wellness Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg md:col-span-2 animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">🧠 Mood Quest</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mentalChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" domain={[0, 10]} />
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                <Legend />
                <Bar dataKey="mood" fill={COLORS[4]} name="Mood" />
                <Bar dataKey="stress" fill={COLORS[3]} name="Stress" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Pie */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">🥧 Wellness Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} label dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Bars */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">🚀 Weekly Progress</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700">Sleep ({totalSleep}/{sleepGoal} hrs)</p>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <div
                    className="h-4 bg-indigo-500 rounded-full"
                    style={{ width: `${sleepProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{Math.round(sleepProgress)}%</p>
              </div>
              <div>
                <p className="text-gray-700">Water ({totalWater}/{waterGoal} ml)</p>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <div
                    className="h-4 bg-green-500 rounded-full"
                    style={{ width: `${waterProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{Math.round(waterProgress)}%</p>
              </div>
              <div>
                <p className="text-gray-700">Mood ({totalMood}/{moodGoal})</p>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <div
                    className="h-4 bg-purple-500 rounded-full"
                    style={{ width: `${moodProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{Math.round(moodProgress)}%</p>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white p-6 rounded-2xl shadow-lg md:col-span-2 animate-slide-in-right">
            <h2 className="text-xl font-semibold mb-4 text-red-600">🏅 Leaderboard</h2>
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-semibold">{index + 1}</span>
                    <p className="text-gray-700">{player.username}</p>
                  </div>
                  <p className="text-gray-600">{player.xp} XP (Level {player.level})</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reward Center */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-green-600">🎁 Reward Center</h2>
            <button
              onClick={() => toast.info("Rewards coming soon!", { position: "top-right" })}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105"
            >
              <FiZap /> Claim Rewards
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes blob {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default GamificationDashboard;
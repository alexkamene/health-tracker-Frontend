"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { FiTrophy, FiStar, FiZap, FiDownload, FiTrello } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COLORS = ["#4C51BF", "#38A169", "#D69E2E", "#E53E3E", "#8B5CF6", "#EC4899"]; // Indigo, Green, Yellow, Red, Purple, Pink

const GamificationDashboard = () => {
  const [healthData, setHealthData] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [points, setPoints] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  
  const [badges, setBadges] = useState([]);
  const [challenges, setChallenges] = useState([
    { id: 1, name: "Step Hero", goal: 10000, current: 0, reward: 50, completed: false },
    { id: 2, name: "Sleep Star", goal: 7, current: 0, reward: 30, completed: false },
  ]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) window.location.href = "/login";

      try {
        const healthResponse = await axios.get("http://localhost:3000/healthdata", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHealthData(healthResponse.data);

        const journalResponse = await axios.get("http://localhost:3000/api/journal", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJournalEntries(journalResponse.data);

        const profileResponse = await axios.get("http://localhost:3000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          username: profileResponse.data.username || "Player",
          email: profileResponse.data.email || "player@example.com",
        });

        // Calculate Points and Badges
        calculateGamification(healthResponse.data, journalResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load game data!", { position: "top-right" });
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
   
    fetchLeaderboard();
  }, []);
const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user/leaderboard");
      
      setLeaderboard(response.data);
    } catch (error) {
      console.error("❌ Error fetching leaderboard:", error);
    }
  };
  // Gamification Logic
  const calculateGamification = (healthData, journalData) => {
    let newPoints = 0;
    const newBadges = [];

    // Points: 1 per 100 steps, 5 per workout, 10 per sleep hour, 20 per journal entry
    newPoints += Math.floor(healthData.reduce((sum, d) => sum + (d.steps || 0), 0) / 100);
    newPoints += healthData.reduce((sum, d) => sum + (d.workouts || 0) * 5, 0);
    newPoints += healthData.reduce((sum, d) => sum + (d.sleepHours || 0) * 10, 0);
    newPoints += journalData.length * 20;
    setPoints(newPoints);

    // Badges
    if (healthData.some(d => d.steps >= 10000)) newBadges.push("Step Master");
    if (healthData.some(d => d.sleepHours >= 8)) newBadges.push("Sleep Champion");
    if (journalData.length >= 5) newBadges.push("Journal Guru");
    if (newPoints >= 500) newBadges.push("Health Hero");
    setBadges(newBadges);

    // Challenges Progress
    const today = new Date().toLocaleDateString();
    const todayHealth = healthData.filter(d => new Date(d.loggedAt).toLocaleDateString() === today);
    setChallenges(challenges.map(challenge => {
      if (challenge.name === "Step Hero") {
        const steps = todayHealth.reduce((sum, d) => sum + (d.steps || 0), 0);
        return { ...challenge, current: steps, completed: steps >= challenge.goal };
      }
      if (challenge.name === "Sleep Star") {
        const sleep = todayHealth.reduce((sum, d) => sum + (d.sleepHours || 0), 0);
        return { ...challenge, current: sleep, completed: sleep >= challenge.goal };
      }
      return challenge;
    }));
  };

  // Chart Data Preparation
  const fitnessChartData = healthData.map((entry) => ({
    date: new Date(entry.loggedAt).toLocaleDateString(),
    steps: entry.steps || 0,
    workouts: entry.workouts || 0,
    calories: entry.caloriesBurned || 0,
  }));

  const wellnessChartData = healthData.map((entry) => ({
    date: new Date(entry.loggedAt).toLocaleDateString(),
    sleep: entry.sleepHours || 0,
    hydration: entry.hydrationLevel || 0,
  }));

  const pieData = [
    { name: "Steps", value: fitnessChartData.reduce((sum, d) => sum + d.steps, 0) },
    { name: "Workouts", value: fitnessChartData.reduce((sum, d) => sum + d.workouts, 0) },
    { name: "Calories", value: fitnessChartData.reduce((sum, d) => sum + d.calories, 0) },
  ].filter(d => d.value > 0);

  // Progress Calculations
  const totalSteps = fitnessChartData.reduce((sum, d) => sum + d.steps, 0);
  const totalSleep = healthData.reduce((sum, d) => sum + (d.sleepHours || 0), 0);
  const stepsGoal = 100000;
  const sleepGoal = healthData.length * 8;
  const stepsProgress = Math.min((totalSteps / stepsGoal) * 100, 100);
  const sleepProgress = Math.min((totalSleep / sleepGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-green-50 to-purple-50 p-4 md:p-6 relative overflow-hidden">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="w-80 h-80 bg-indigo-200 rounded-full absolute top-10 left-10 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-green-200 rounded-full absolute bottom-20 right-20 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 animate-fade-in-down">
          Hey, <span className="text-green-600">{profile.username}</span>! Ready to Level Up?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Player Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">🎮 Player Stats</h2>
            <div className="flex items-center gap-4 mb-4">
              <img src="https://via.placeholder.com/80" alt="Avatar" className="w-20 h-20 rounded-full border-4 border-yellow-500" />
              <div>
                <p className="text-lg font-semibold text-gray-900">{profile.username}</p>
                <p className="text-gray-600">Points: <span className="text-yellow-600">{points}</span></p>
              </div>
            </div>
            <div className="text-gray-700">
              <p>Level: <span className="font-semibold text-indigo-600">{Math.floor(points / 100)}</span></p>
            </div>
          </div>

          {/* Points & Badges */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-green-600">🏆 Achievements</h2>
            <div className="space-y-4">
              <p className="text-gray-700">Points Earned: <span className="text-yellow-600 font-semibold">{points}</span></p>
              <div>
                <p className="text-gray-700 font-semibold">Badges ({badges.length}):</p>
                {badges.length === 0 ? (
                  <p className="text-gray-500">No badges yet—keep going!</p>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {badges.map((badge, idx) => (
                      <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
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
            <h2 className="text-xl font-semibold mb-4 text-purple-600">⚡ Daily Challenges</h2>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-700">{challenge.name}</p>
                    <p className="text-sm text-gray-500">
                      {challenge.current}/{challenge.goal} {challenge.name.includes("Step") ? "steps" : "hrs"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${Math.min((challenge.current / challenge.goal) * 100, 100)}%` }}
                      />
                    </div>
                    {challenge.completed && <FiStar className="text-yellow-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fitness Progress Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg md:col-span-2 animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">🏃‍♂️ Fitness Quest</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fitnessChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                <Legend />
                <Line type="monotone" dataKey="steps" stroke={COLORS[0]} name="Steps" />
                <Line type="monotone" dataKey="workouts" stroke={COLORS[3]} name="Workouts" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wellness Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">🧘 Wellness Power</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wellnessChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                <Legend />
                <Bar dataKey="sleep" fill={COLORS[1]} name="Sleep" />
                <Bar dataKey="hydration" fill={COLORS[2]} name="Hydration" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Breakdown Pie */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-green-600">🥧 Power Breakdown</h2>
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
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">🚀 Goal Progress</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700">Steps Quest ({totalSteps}/{stepsGoal})</p>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <div className="h-4 bg-indigo-500 rounded-full" style={{ width: `${stepsProgress}%` }} />
                </div>
                <p className="text-sm text-gray-500">{Math.round(stepsProgress)}%</p>
              </div>
              <div>
                <p className="text-gray-700">Sleep Quest ({totalSleep}/{sleepGoal} hrs)</p>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <div className="h-4 bg-purple-500 rounded-full" style={{ width: `${sleepProgress}%` }} />
                </div>
                <p className="text-sm text-gray-500">{Math.round(sleepProgress)}%</p>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white p-6 rounded-2xl shadow-lg md:col-span-2 animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-red-600">🏅 Leaderboard</h2>
            <div className="space-y-3">
             {leaderboard.map((player,index) =>(
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600 font-semibold">{index + 1}</span>
                    <p className="text-gray-700">{ player.username}</p>
                  </div>
                  <p className="text-gray-600">{player.xp} XP (Level {player.level}) pts</p>
                </div>
              ))}
            </div>  
          </div>

          {/* Journal Highlights */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right max-h-64 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">📝 Adventure Log</h2>
            {journalEntries.length === 0 ? (
              <p className="text-gray-500 text-center">No logs yet—start your story!</p>
            ) : (
              journalEntries.slice(0, 3).map((entry) => (
                <div key={entry._id} className="mb-4">
                  <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                  <p className="text-gray-700">{entry.entry.substring(0, 100)}...</p>
                </div>
              ))
            )}
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
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
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
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out; }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default GamificationDashboard;
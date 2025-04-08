"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function SleepTracker() {
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [weeklySleep, setWeeklySleep] = useState([]);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "Maintain a consistent sleep schedule, even on weekends.",
    "Limit screen time 1-2 hours before bed to reduce blue light exposure.",
    "Keep your bedroom cool (60-67°F), dark, and quiet.",
    "Avoid caffeine or heavy meals close to bedtime.",
    "Create a relaxing pre-sleep routine, like reading or meditation.",
  ];

  const calculateDuration = (sleep, wake) => {
    const sleepDate = new Date(`1970-01-01T${sleep}:00`);
    const wakeDate = new Date(`1970-01-02T${wake}:00`);
    const duration = (wakeDate - sleepDate) / (1000 * 60 * 60);
    return duration < 0 ? duration + 24 : duration;
  };

  const submitSleep = async () => {
    if (!sleepTime || !wakeTime) return alert("Please enter both sleep and wake times.");
    const duration = calculateDuration(sleepTime, wakeTime);
    try {
      await axios.post(
        "https://heath-tracker-backend.onrender.com/sleep",
        {
          date: new Date(),
          sleepTime,
          wakeTime,
          duration,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchSleepData();
      setSleepTime("");
      setWakeTime("");
      alert("✅ Sleep logged successfully!");
    } catch (err) {
      console.error("Failed to submit sleep:", err);
      alert("❌ Failed to log sleep.");
    }
  };

  const fetchSleepData = async () => {
    try {
      const res = await axios.get("https://heath-tracker-backend.onrender.com/sleep/week", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWeeklySleep(res.data.reverse());
    } catch (err) {
      console.error("Failed to fetch sleep data:", err);
      alert("❌ Failed to fetch sleep data.");
    }
  };

  useEffect(() => {
    fetchSleepData();
  }, []);

  // Additional Information
  const avgSleep = weeklySleep.length > 0
    ? weeklySleep.reduce((sum, e) => sum + e.duration, 0) / weeklySleep.length
    : 0;
  const sleepScore = Math.min(
    100,
    Math.round((weeklySleep.reduce((sum, e) => sum + Math.min(e.duration, 8), 0) / (7 * 8)) * 100)
  );
  const sleepConsistency = weeklySleep.length > 1
    ? Math.round(
        (1 -
          weeklySleep
            .slice(1)
            .reduce((sum, e, i) => sum + Math.abs(e.duration - weeklySleep[i].duration), 0) /
            (weeklySleep.length - 1) /
            avgSleep) * 100
      )
    : 100;
  const getEmoji = (duration) => {
    if (duration >= 8) return "🟢";
    if (duration >= 6) return "🟡";
    return "🔴";
  };
  const getQualityText = (score) => {
    if (score >= 80) return "Excellent 🌙";
    if (score >= 60) return "Good 😴";
    if (score >= 40) return "Fair 😐";
    return "Poor 😪";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="w-72 h-72 bg-blue-200 rounded-full absolute top-0 left-0 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-teal-200 rounded-full absolute bottom-10 right-10 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800 animate-fade-in-down z-10 relative">
        🛌 Sleep Tracker
      </h1>

      {/* Input Section */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-blue-100 z-10 relative animate-slide-in-up">
        <h2 className="text-2xl font-semibold text-teal-600 mb-6">Log Your Sleep</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Sleep Time</label>
            <input
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="w-full p-3 bg-blue-50 border border-blue-300 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Wake Time</label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full p-3 bg-blue-50 border border-blue-300 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={submitSleep}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
            >
              Log Sleep
            </button>
          </div>
        </div>
      </div>

      {/* Sleep Insights */}
      {weeklySleep.length > 0 && (
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-teal-100 z-10 relative animate-slide-in-up">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Sleep Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center bg-blue-50 p-4 rounded-lg shadow-md">
              <p className="text-sm font-medium text-blue-700">Average Sleep</p>
              <p className="text-2xl font-bold text-teal-600">{avgSleep.toFixed(1)} hrs</p>
              <p className="text-sm text-blue-600">
                {avgSleep >= 7 ? "✅ Optimal" : "⚠️ Below Recommended"}
              </p>
            </div>
            <div className="text-center bg-teal-50 p-4 rounded-lg shadow-md">
              <p className="text-sm font-medium text-teal-700">Sleep Score</p>
              <p className="text-2xl font-bold text-blue-600">{sleepScore}/100</p>
              <p className="text-sm text-teal-600">Quality: {getQualityText(sleepScore)}</p>
            </div>
            <div className="text-center bg-blue-50 p-4 rounded-lg shadow-md">
              <p className="text-sm font-medium text-blue-700">Consistency</p>
              <p className="text-2xl font-bold text-teal-600">{sleepConsistency}%</p>
              <p className="text-sm text-blue-600">Schedule Stability</p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Sleep Chart */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-blue-100 z-10 relative animate-slide-in-up">
        <h2 className="text-2xl font-semibold text-teal-600 mb-6">Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={weeklySleep.map((e) => ({
              date: new Date(e.date).toLocaleDateString(),
              duration: e.duration,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis
              stroke="#6B7280"
              label={{ value: "Hours", angle: -90, position: "insideLeft", fill: "#6B7280" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", borderColor: "#E5E7EB" }}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Bar dataKey="duration" fill="#38BDF8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Summary */}
      {weeklySleep.length > 0 && (
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-teal-100 z-10 relative animate-slide-in-up">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Daily Breakdown</h2>
          <ul className="space-y-4">
            {weeklySleep.map((e, index) => (
              <li key={index} className="bg-blue-50 p-4 rounded-lg shadow-md flex items-center gap-3">
                <span className="text-xl">{getEmoji(e.duration)}</span>
                <span className="font-semibold text-teal-700">
                  {new Date(e.date).toLocaleDateString()}:
                </span>
                <span className="text-blue-600">{e.duration.toFixed(1)} hrs</span>
                <span className="text-sm text-teal-500">({e.sleepTime} - {e.wakeTime})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-teal-50 shadow-xl rounded-xl p-6 border border-teal-200 z-10 relative animate-slide-in-up">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Sleep Tip</h2>
        <p className="text-teal-800 text-lg mb-4">{tips[tipIndex]}</p>
        <button
          onClick={() => setTipIndex((prev) => (prev + 1) % tips.length)}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-all duration-300 transform hover:scale-105"
        >
          Next Tip
        </button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        /* Custom Time Input */
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%);
        }
        input[type="time"] {
          appearance: none;
          -webkit-appearance: none;
        }

        /* Animations */
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out; }
        .animate-slide-in-up { animation: slideInUp 0.8s ease-out; }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}
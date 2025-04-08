"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const mentalTips = [
  "Take deep breaths and meditate for 5 minutes to calm your mind.",
  "Step outside for a short walk to refresh your perspective.",
  "Schedule regular breaks to prioritize your mental health.",
  "Hydrate and stretch for 2 minutes to relieve tension.",
  "Jot down 3 things you’re grateful for to boost positivity.",
];

const moodPresets = [
  { label: "😞 Low (1-3)", value: 2 },
  { label: "😐 Neutral (4-6)", value: 5 },
  { label: "😊 High (7-10)", value: 8 },
];

const stressPresets = [
  { label: "🧘 Calm (1-3)", value: 2 },
  { label: "😬 Moderate (4-6)", value: 5 },
  { label: "😰 High (7-10)", value: 8 },
];

export default function MentalWellnessTracker() {
  const [mood, setMood] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [notes, setNotes] = useState("");
  const [weeklyEntries, setWeeklyEntries] = useState([]);
  const [tip, setTip] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchEntries = async () => {
    try {
      const res = await axios.get("https://heath-tracker-backend.onrender.com/mental-wellness/week", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklyEntries(res.data.reverse());
    } catch (err) {
      console.error("Error fetching entries:", err);
      alert("❌ Failed to fetch entries.");
    }
  };

  const submitEntry = async () => {
    if (!mood || !stressLevel) return alert("Please set mood and stress levels.");
    try {
      await axios.post(
        "https://heath-tracker-backend.onrender.com/mental-wellness",
        {
          mood,
          stressLevel,
          notes,
          date: new Date(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes("");
      setMood(5);
      setStressLevel(5);
      fetchEntries();
      setTip(mentalTips[Math.floor(Math.random() * mentalTips.length)]);
      alert("✅ Entry logged successfully!");
    } catch (err) {
      console.error("Error submitting entry:", err);
      alert("❌ Failed to log entry.");
    }
  };

  useEffect(() => {
    if (token) fetchEntries();
  }, [token]);

  // Calculate averages
  const avgMood =
    weeklyEntries.length > 0
      ? (weeklyEntries.reduce((sum, e) => sum + e.mood, 0) / weeklyEntries.length).toFixed(1)
      : 0;
  const avgStress =
    weeklyEntries.length > 0
      ? (weeklyEntries.reduce((sum, e) => sum + e.stressLevel, 0) / weeklyEntries.length).toFixed(1)
      : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="w-72 h-72 bg-purple-200 rounded-full absolute top-0 left-0 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-teal-200 rounded-full absolute bottom-10 right-10 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8 text-purple-800 animate-fade-in-down z-10 relative">
        🧠 Mental Wellness Tracker
      </h1>

      {/* Input Section */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-purple-100 z-10 relative animate-slide-in-up">
        <h2 className="text-2xl font-semibold text-teal-600 mb-6">Log Your Mood</h2>
        <div className="space-y-8">
          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Mood (1-10)</label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-purple-200 to-teal-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, #C4B5FD ${((mood - 1) / 9) * 100}%, #E5E7EB ${((mood - 1) / 9) * 100}%)`,
                }}
              />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-sm font-semibold rounded-full px-2 py-1 shadow-md">
                {mood}
              </span>
            </div>
            <div className="mt-4 flex gap-3 flex-wrap justify-center">
              {moodPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setMood(preset.value)}
                  className="bg-gradient-to-r from-purple-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:from-purple-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stress */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Stress Level (1-10)</label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-purple-200 to-teal-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, #5EEAD4 ${((stressLevel - 1) / 9) * 100}%, #E5E7EB ${((stressLevel - 1) / 9) * 100}%)`,
                }}
              />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white text-sm font-semibold rounded-full px-2 py-1 shadow-md">
                {stressLevel}
              </span>
            </div>
            <div className="mt-4 flex gap-3 flex-wrap justify-center">
              {stressPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setStressLevel(preset.value)}
                  className="bg-gradient-to-r from-teal-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:from-teal-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-purple-50 border border-purple-300 rounded-lg text-purple-800 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 resize-none shadow-sm hover:shadow-md"
              placeholder="Add reflections or thoughts..."
              rows="4"
            />
          </div>

          <button
            onClick={submitEntry}
            className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
          >
            Log Entry
          </button>
        </div>
      </div>

      {/* Insights */}
      {weeklyEntries.length > 0 && (
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-teal-100 z-10 relative animate-slide-in-up">
          <h2 className="text-2xl font-semibold text-purple-600 mb-6">Wellness Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-center bg-purple-50 p-4 rounded-lg shadow-md">
              <p className="text-sm font-medium text-purple-700">Average Mood</p>
              <p className="text-2xl font-bold text-teal-600">{avgMood} / 10</p>
              <p className="text-sm text-purple-600">
                {avgMood >= 7 ? "😊 Positive" : avgMood >= 4 ? "😐 Neutral" : "😞 Low"}
              </p>
            </div>
            <div className="text-center bg-teal-50 p-4 rounded-lg shadow-md">
              <p className="text-sm font-medium text-teal-700">Average Stress</p>
              <p className="text-2xl font-bold text-purple-600">{avgStress} / 10</p>
              <p className="text-sm text-teal-600">
                {avgStress <= 3 ? "🧘 Calm" : avgStress <= 6 ? "😬 Moderate" : "😰 High"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Chart */}
      {weeklyEntries.length > 0 && (
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-purple-100 z-10 relative animate-slide-in-up">
          <h2 className="text-2xl font-semibold text-teal-600 mb-6">Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={weeklyEntries.map((e) => ({
                date: new Date(e.date).toLocaleDateString(),
                mood: e.mood,
                stress: e.stressLevel,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" domain={[0, 10]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderColor: "#E5E7EB" }}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              />
              <Legend />
              <Bar dataKey="mood" fill="#A78BFA" name="Mood" />
              <Bar dataKey="stress" fill="#5EEAD4" name="Stress" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Daily Summary */}
      {weeklyEntries.length > 0 && (
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-teal-100 z-10 relative animate-slide-in-up">
          <h2 className="text-2xl font-semibold text-purple-600 mb-6">Daily Entries</h2>
          <ul className="space-y-4">
            {weeklyEntries.map((entry) => (
              <li key={entry._id} className="bg-purple-50 p-4 rounded-lg shadow-md">
                <p className="font-semibold text-teal-700">{new Date(entry.date).toLocaleDateString()}</p>
                <p className="text-purple-600">
                  Mood: {entry.mood} / 10 {entry.mood >= 7 ? "😊" : entry.mood >= 4 ? "😐" : "😞"}
                </p>
                <p className="text-teal-600">
                  Stress: {entry.stressLevel} / 10{" "}
                  {entry.stressLevel <= 3 ? "🧘" : entry.stressLevel <= 6 ? "😬" : "😰"}
                </p>
                {entry.notes && <p className="text-sm text-purple-500 mt-2">Notes: {entry.notes}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips Section */}
      {tip && (
        <div className="bg-teal-50 shadow-xl rounded-xl p-6 border border-teal-200 z-10 relative animate-slide-in-up">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">Mental Wellness Tip</h2>
          <p className="text-teal-800 text-lg">{tip}</p>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        /* Custom Range Slider */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          border: 3px solid #A78BFA;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        input[type="range"]:focus::-webkit-slider-thumb {
          border-color: #5EEAD4;
          transform: scale(1.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border: 3px solid #A78BFA;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        input[type="range"]:focus::-moz-range-thumb {
          border-color: #5EEAD4;
          transform: scale(1.2);
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
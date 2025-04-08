"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function WaterTracker() {
  const [amount, setAmount] = useState("");
  const [weeklyWater, setWeeklyWater] = useState([]);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "Kick off your day with a glass of water to boost hydration.",
    "Keep a reusable water bottle handy for easy sipping.",
    "Drink a glass before meals to aid digestion.",
    "Add fruit slices like lemon or cucumber for flavor.",
    "Set hourly reminders to maintain consistent intake.",
  ];

  const recommendedAmounts = [
    { label: "Small Glass (250ml)", value: 250 },
    { label: "Medium Glass (500ml)", value: 500 },
    { label: "Large Bottle (1000ml)", value: 1000 },
  ];

  const DAILY_GOAL = 2000; // Daily water goal in ml

  const submitWater = async () => {
    if (!amount) return alert("Please enter or select an amount.");
    try {
      await axios.post(
        "https://heath-tracker-backend.onrender.com/water",
        {
          date: new Date(),
          amount: Number(amount),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAmount("");
      fetchWaterData();
      alert("✅ Water logged successfully!");
    } catch (err) {
      console.error("Error submitting water intake:", err);
      alert("❌ Failed to log water.");
    }
  };

  const fetchWaterData = async () => {
    try {
      const res = await axios.get("https://heath-tracker-backend.onrender.com/water/week", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWeeklyWater(res.data.reverse());
    } catch (err) {
      console.error("Error fetching water data:", err);
      alert("❌ Failed to fetch water data.");
    }
  };

  useEffect(() => {
    fetchWaterData();
  }, []);

  // Calculate totals and progress
  const totalIntake = weeklyWater.reduce((sum, entry) => sum + entry.amount, 0);
  const todayIntake = weeklyWater
    .filter((entry) => new Date(entry.date).toDateString() === new Date().toDateString())
    .reduce((sum, entry) => sum + entry.amount, 0);
  const progressPercentage = Math.min((todayIntake / DAILY_GOAL) * 100, 100).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="w-72 h-72 bg-blue-200 rounded-full absolute top-0 left-0 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-teal-200 rounded-full absolute bottom-10 right-10 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800 animate-fade-in-down z-10 relative">
        💧 Water Tracker
      </h1>

      {/* Input Section */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-blue-100 z-10 relative animate-slide-in-up">
        <h2 className="text-2xl font-semibold text-teal-600 mb-6">Log Your Water</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Amount (ml)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Custom amount"
              className="w-full p-3 bg-blue-50 border border-blue-300 rounded-lg text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
            />
            <div className="mt-4 flex gap-3 flex-wrap">
              {recommendedAmounts.map((rec, idx) => (
                <button
                  key={idx}
                  onClick={() => setAmount(rec.value)}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:from-blue-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
                >
                  {rec.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={submitWater}
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Log Water
            </button>
          </div>
        </div>
      </div>

      {/* Hydration Insights */}
      {weeklyWater.length > 0 && (
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-teal-100 z-10 relative animate-slide-in-up">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Hydration Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center bg-blue-50 p-4 rounded-lg shadow-md">
              <p className="text-sm font-medium text-blue-700">Today’s Intake</p>
              <p className="text-2xl font-bold text-teal-600">{todayIntake} ml</p>
              <p className="text-sm text-blue-600">Goal: {DAILY_GOAL} ml</p>
            </div>
            <div className="text-center bg-teal-50 p-4 rounded-lg shadow-md">
              <p className="text-sm font-medium text-teal-700">Weekly Total</p>
              <p className="text-2xl font-bold text-blue-600">{totalIntake} ml</p>
              <p className="text-sm text-teal-600">Avg: {(totalIntake / 7).toFixed(0)} ml/day</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercentage}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-600">{progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Water Chart */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-blue-100 z-10 relative animate-slide-in-up">
        <h2 className="text-2xl font-semibold text-teal-600 mb-6">Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={weeklyWater.map((e) => ({
              date: new Date(e.date).toLocaleDateString(),
              amount: e.amount,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis
              stroke="#6B7280"
              label={{ value: "ml", angle: -90, position: "insideLeft", fill: "#6B7280" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", borderColor: "#E5E7EB" }}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Bar dataKey="amount" fill="#38BDF8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Summary */}
      {weeklyWater.length > 0 && (
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-teal-100 z-10 relative animate-slide-in-up">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Daily Breakdown</h2>
          <ul className="space-y-4">
            {weeklyWater.map((e, index) => (
              <li key={index} className="bg-blue-50 p-4 rounded-lg shadow-md flex items-center gap-3">
                <span className="text-xl">💧</span>
                <span className="font-semibold text-teal-700">
                  {new Date(e.date).toLocaleDateString()}:
                </span>
                <span className="text-blue-600">{e.amount} ml</span>
                {e.timestamp && (
                  <span className="text-sm text-teal-500">({e.timestamp})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-teal-50 shadow-xl rounded-xl p-6 border border-teal-200 z-10 relative animate-slide-in-up">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Hydration Tip</h2>
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
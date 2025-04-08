"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const exerciseTypes = [
  { name: "Walking slowly", met: 2.0 },
  { name: "Yoga (asanas + pranayama)", met: 3.3 },
  { name: "Walking at 3.0 mph", met: 3.0 },
  { name: "Sweeping/mopping floors", met: 3.5 },
  { name: "Tennis (doubles)", met: 5.0 },
  { name: "Weight lifting (moderate)", met: 5.0 },
  { name: "Bicycling (10 mph, flat)", met: 6.0 },
  { name: "Aerobic dancing", met: 6.0 },
  { name: "Jumping jacks", met: 6.5 },
  { name: "Basketball game", met: 8.0 },
  { name: "Swimming (moderate)", met: 8.0 },
  { name: "Jogging (5.6 mph)", met: 8.8 },
  { name: "Rope jumping (66/min)", met: 9.8 },
  { name: "Football", met: 10.3 },
  { name: "Rope jumping (100/min)", met: 11.0 },
  { name: "Jogging (6.8 mph)", met: 11.2 },
];

const COLORS = ["#34D399", "#3B82F6", "#A78BFA", "#FBBF24", "#F87171"]; // Green, Blue, Purple, Yellow, Red

export default function ExerciseTracker() {
  const [selectedExercise, setSelectedExercise] = useState(exerciseTypes[0]);
  const [duration, setDuration] = useState("");
  const [weight, setWeight] = useState(70);
  const [calories, setCalories] = useState(0);
  const [token, setToken] = useState("");
  const [Exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://heath-tracker-backend.onrender.com/my-exercises", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExercises(res.data);
      } catch (err) {
        console.error("Error fetching exercises:", err);
      }
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (duration && selectedExercise) {
      const durationInHours = parseFloat(duration) / 60;
      const burned = selectedExercise.met * weight * durationInHours;
      setCalories(Math.round(burned));
    }
  }, [duration, selectedExercise, weight]);

  const saveExercise = async () => {
    if (!duration) return alert("Please enter duration");
    try {
      await axios.post(
        "https://heath-tracker-backend.onrender.com/exercise/add",
        {
          name: selectedExercise.name,
          duration: parseFloat(duration),
          caloriesBurned: calories,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Exercise saved!");
      setDuration("");
      fetchExercises();
    } catch (err) {
      console.error("Error saving exercise:", err);
      alert("❌ Failed to save exercise.");
    }
  };

  const fetchExercises = async () => {
    try {
      const res = await axios.get("https://heath-tracker-backend.onrender.com/my-exercises", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(res.data);
    } catch (err) {
      console.error("Error fetching exercises:", err);
    }
  };

  // Chart Data
  const lineChartData = Exercises.map((ex) => ({
    date: new Date(ex.date).toLocaleDateString(),
    calories: ex.caloriesBurned,
  }));

  const barChartData = Exercises.reduce((acc, ex) => {
    const name = ex.name;
    const found = acc.find((e) => e.name === name);
    if (found) {
      found.duration += ex.duration;
    } else {
      acc.push({ name, duration: ex.duration });
    }
    return acc;
  }, []);

  const pieChartData = Exercises.reduce((acc, ex) => {
    const name = ex.name;
    const found = acc.find((e) => e.name === name);
    if (found) {
      found.calories += ex.caloriesBurned;
    } else {
      acc.push({ name, calories: ex.caloriesBurned });
    }
    return acc;
  }, []);

  const areaChartData = Exercises.map((ex) => ({
    date: new Date(ex.date).toLocaleDateString(),
    duration: ex.duration,
  }));

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="w-72 h-72 bg-green-200 rounded-full absolute top-0 left-0 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-blue-200 rounded-full absolute bottom-10 right-10 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <h1 className="text-4xl font-bold text-center mb-10 text-green-800 animate-fade-in-down z-10 relative">
        🚴 Exercise Tracker
      </h1>

      {/* Input Form */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-10 border border-green-100 z-10 relative animate-slide-in-up">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">Log Your Workout</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Select Exercise</label>
            <select
              value={selectedExercise.name}
              onChange={(e) =>
                setSelectedExercise(exerciseTypes.find((ex) => ex.name === e.target.value))
              }
              className="w-full p-3 bg-green-50 border border-green-300 rounded-lg text-green-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {exerciseTypes.map((exercise, idx) => (
                <option key={idx} value={exercise.name}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 bg-green-50 border border-green-300 rounded-lg text-green-800 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              placeholder="Enter duration"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Your Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full p-3 bg-green-50 border border-green-300 rounded-lg text-green-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
            />
          </div>

          <p className="text-blue-600 font-medium">
            🔥 Estimated Calories Burned:{" "}
            <span className="text-2xl font-bold text-purple-600">{calories}</span> kcal
          </p>

          <button
            onClick={saveExercise}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Save Exercise
          </button>
        </div>
      </div>

      {/* Charts */}
      {Exercises.length > 0 && (
        <div className="bg-white shadow-xl rounded-xl p-6 border border-blue-100 z-10 relative animate-slide-in-up">
          <h3 className="text-2xl font-semibold text-purple-600 mb-8">📊 Your Exercise Insights</h3>

          {/* Line Chart */}
          <div className="mb-10">
            <h4 className="font-semibold mb-4 text-blue-600">🔥 Calories Burned Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#E5E7EB" }} />
                <Line type="monotone" dataKey="calories" stroke="#34D399" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="mb-10">
            <h4 className="font-semibold mb-4 text-purple-600">⏱️ Duration per Exercise</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#E5E7EB" }} />
                <Legend />
                <Bar dataKey="duration" fill="#A78BFA" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="mb-10">
            <h4 className="font-semibold mb-4 text-green-600">🥧 Calorie Distribution by Exercise</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={100} label dataKey="calories">
                  {pieChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#E5E7EB" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Area Chart */}
          <div>
            <h4 className="font-semibold mb-4 text-blue-600">🏋️ Duration Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={areaChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#E5E7EB" }} />
                <Area
                  type="monotone"
                  dataKey="duration"
                  stroke="#3B82F6"
                  fillOpacity={0.3}
                  fill="#3B82F6"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        /* Custom Select */
        select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2334D399'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.5em;
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
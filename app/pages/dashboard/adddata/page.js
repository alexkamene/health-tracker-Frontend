"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FiSave } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COLORS = ["#4C51BF", "#38A169", "#D69E2E", "#E53E3E", "#8B5CF6"]; // Indigo, Green, Yellow, Red, Purple

const LogHealthData = () => {
  const [fitnessData, setFitnessData] = useState({ steps: "", workouts: "", caloriesBurned: "" });
  const [wellnessData, setWellnessData] = useState({ sleepHours: "", hydrationLevel: "", moodScore: "", screenTime: "", mentalFocus: "", recoveryIndex: "" });
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) window.location.href = "/login";
      const response = await axios.get("http://localhost:3000/healthdata", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHealthData(response.data);
    } catch (error) {
      console.error("Error fetching health data:", error);
      toast.error("Failed to load health data.", { position: "top-right" });
    }
  };

  // Prepare Data for Charts
  const fitnessChartData = healthData.map((entry) => ({
    date: new Date(entry.loggedAt).toLocaleDateString(),
    steps: entry.steps,
    workouts: entry.workouts,
    calories: entry.caloriesBurned,
  }));

  const wellnessChartData = healthData.map((entry) => ({
    date: new Date(entry.loggedAt).toLocaleDateString(),
    sleep: entry.sleepHours,
    hydration: entry.hydrationLevel,
    mood: entry.moodScore,
    screenTime: entry.screenTime,
  }));

  const pieData = [
    { name: "Steps", value: fitnessChartData.reduce((sum, d) => sum + (d.steps || 0), 0) },
    { name: "Workouts", value: fitnessChartData.reduce((sum, d) => sum + (d.workouts || 0), 0) },
    { name: "Calories", value: fitnessChartData.reduce((sum, d) => sum + (d.calories || 0), 0) },
  ].filter(d => d.value > 0); // Filter out zero values for cleaner pie chart

  const handleFitnessChange = (e) => setFitnessData({ ...fitnessData, [e.target.name]: e.target.value });
  const handleWellnessChange = (e) => setWellnessData({ ...wellnessData, [e.target.name]: e.target.value });

  const logFitnessData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/log/fitness", fitnessData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🎉 Fitness data logged successfully!", { position: "top-right" });
      setFitnessData({ steps: "", workouts: "", caloriesBurned: "" });
      fetchData();
    } catch (error) {
      console.error("❌ Error logging fitness data:", error);
      toast.error("⚠️ Failed to log fitness data.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const logWellnessData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/log/wellness", wellnessData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🎉 Wellness data logged successfully!", { position: "top-right" });
      setWellnessData({ sleepHours: "", hydrationLevel: "", moodScore: "", screenTime: "", mentalFocus: "", recoveryIndex: "" });
      fetchData();
    } catch (error) {
      console.error("❌ Error logging wellness data:", error);
      toast.error("⚠️ Failed to log wellness data.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-green-50 to-purple-50 p-6 relative overflow-hidden">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="w-80 h-80 bg-indigo-200 rounded-full absolute top-10 left-10 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-green-200 rounded-full absolute bottom-20 right-20 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 animate-fade-in-down">
          <span className="text-green-600">Log & Analyze Your Health</span>
        </h1>

        <Tabs>
          <TabList className="flex justify-center gap-4 mb-6 bg-white p-2 rounded-2xl shadow-lg animate-fade-in-up">
            <Tab className="px-6 py-3 rounded-lg font-semibold text-gray-700 cursor-pointer transition-all duration-300 hover:bg-indigo-100 focus:bg-indigo-200 focus:outline-none">🏃‍♂️ Fitness</Tab>
            <Tab className="px-6 py-3 rounded-lg font-semibold text-gray-700 cursor-pointer transition-all duration-300 hover:bg-purple-100 focus:bg-purple-200 focus:outline-none">🧘 Wellness</Tab>
            <Tab className="px-6 py-3 rounded-lg font-semibold text-gray-700 cursor-pointer transition-all duration-300 hover:bg-green-100 focus:bg-green-200 focus:outline-none">📊 Analytics</Tab>
          </TabList>

          {/* Fitness Logging */}
          <TabPanel>
            <form
              onSubmit={logFitnessData}
              className="bg-white p-6 rounded-2xl shadow-lg max-w-lg mx-auto transform transition-all duration-300 hover:shadow-xl animate-fade-in-up"
            >
              <h2 className="text-2xl font-semibold text-center mb-6 text-indigo-600">🏃‍♂️ Log Fitness Data</h2>
              {[
                { name: "steps", placeholder: "Steps Taken", type: "number" },
                { name: "workouts", placeholder: "Workouts (mins)", type: "number" },
                { name: "caloriesBurned", placeholder: "Calories Burned", type: "number" },
              ].map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  value={fitnessData[field.name]}
                  onChange={handleFitnessChange}
                  placeholder={field.placeholder}
                  className="p-3 border border-gray-300 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300"
                  disabled={loading}
                />
              ))}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <FiSave /> Log Fitness Data
                  </>
                )}
              </button>
            </form>
          </TabPanel>

          {/* Wellness Logging */}
          <TabPanel>
            <form
              onSubmit={logWellnessData}
              className="bg-white p-6 rounded-2xl shadow-lg max-w-lg mx-auto transform transition-all duration-300 hover:shadow-xl animate-fade-in-up"
            >
              <h2 className="text-2xl font-semibold text-center mb-6 text-purple-600">🧘 Log Wellness Data</h2>
              {[
                { name: "sleepHours", placeholder: "Sleep (hrs)", type: "number" },
                { name: "hydrationLevel", placeholder: "Water Intake (L)", type: "number" },
                { name: "moodScore", placeholder: "Mood Score (1-10)", type: "number" },
                { name: "screenTime", placeholder: "Screen Time (hrs)", type: "number" },
              ].map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  value={wellnessData[field.name]}
                  onChange={handleWellnessChange}
                  placeholder={field.placeholder}
                  className="p-3 border border-gray-300 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300"
                  disabled={loading}
                />
              ))}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <FiSave /> Log Wellness Data
                  </>
                )}
              </button>
            </form>
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fitness Progress */}
              <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
                <h3 className="text-xl font-semibold mb-4 text-indigo-600">📈 Fitness Progress</h3>
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

              {/* Wellness Overview */}
              <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
                <h3 className="text-xl font-semibold mb-4 text-purple-600">🧘 Wellness Overview</h3>
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

              {/* Activity Breakdown */}
              <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
                <h3 className="text-xl font-semibold mb-4 text-green-600">🥧 Activity Breakdown</h3>
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

              {/* Fitness Overview */}
              <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
                <h3 className="text-xl font-semibold mb-4 text-yellow-600">🏋️‍♂️ Fitness Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={fitnessChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                    <Legend />
                    <Line type="monotone" dataKey="calories" stroke={COLORS[2]} name="Calories Burned" />
                    <Line type="monotone" dataKey="steps" stroke={COLORS[0]} name="Steps" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabPanel>
        </Tabs>
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

export default LogHealthData;
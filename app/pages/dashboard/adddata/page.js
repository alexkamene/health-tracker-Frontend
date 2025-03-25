"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8A2BE2"];

const LogHealthData = () => {
  const [fitnessData, setFitnessData] = useState({ steps: "", workouts: "", caloriesBurned: "" });
  const [wellnessData, setWellnessData] = useState({ sleepHours: "", hydrationLevel: "", moodScore: "", screenTime: "", mentalFocus: "", recoveryIndex: "" });
  const [healthData, setHealthData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://heath-tracker-backend.onrender.com/healthdata", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHealthData(response.data);
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };
    fetchData();
  }, []);

  // 📌 Prepare Data for Charts
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
    { name: "Steps", value: fitnessChartData.reduce((sum, d) => sum + d.steps, 0) },
    { name: "Workouts", value: fitnessChartData.reduce((sum, d) => sum + d.workouts, 0) },
    { name: "Calories", value: fitnessChartData.reduce((sum, d) => sum + d.calories, 0) },
  ];

  const handleFitnessChange = (e) => setFitnessData({ ...fitnessData, [e.target.name]: e.target.value });
  const handleWellnessChange = (e) => setWellnessData({ ...wellnessData, [e.target.name]: e.target.value });

  const logFitnessData = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("https://heath-tracker-backend.onrender.com/log/fitness", fitnessData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
      setFitnessData({ steps: "", workouts: "", caloriesBurned: "" });
    } catch (error) {
      console.error("❌ Error logging fitness data:", error);
      setMessage("⚠️ Failed to log fitness data.");
    }
  };

  const logWellnessData = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("https://heath-tracker-backend.onrender.com/log/wellness", wellnessData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
      setWellnessData({ sleepHours: "", hydrationLevel: "", moodScore: "", screenTime: "", mentalFocus: "", recoveryIndex: "" });
    } catch (error) {
      console.error("❌ Error logging wellness data:", error);
      setMessage("⚠️ Failed to log wellness data.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Log & Analyze Your Health Data</h1>
      {message && <p className="text-center text-green-500">{message}</p>}

      <Tabs>
        <TabList>
          <Tab>🏃‍♂️ Fitness</Tab>
          <Tab>🧘 Wellness</Tab>
          <Tab>📊 Analytics</Tab>
        </TabList>

        {/* ✅ Fitness Logging */}
        <TabPanel>
          <form onSubmit={logFitnessData} className="bg-white p-6 shadow-md rounded-lg max-w-lg mx-auto">
            <h2 className="text-xl font-semibold text-center text-green-600 mb-4">🏃‍♂️ Log Fitness Data</h2>
            <input type="number" name="steps" value={fitnessData.steps} onChange={handleFitnessChange} placeholder="Steps Taken" className="p-2 border rounded w-full mb-3" />
            <input type="number" name="workouts" value={fitnessData.workouts} onChange={handleFitnessChange} placeholder="Workouts Completed" className="p-2 border rounded w-full mb-3" />
            <input type="number" name="caloriesBurned" value={fitnessData.caloriesBurned} onChange={handleFitnessChange} placeholder="Calories Burned" className="p-2 border rounded w-full mb-3" />
            <button type="submit" className="bg-blue-500 text-white py-2 rounded w-full">💾 Log Fitness Data</button>
          </form>
        </TabPanel>

        {/* ✅ Wellness Logging */}
        <TabPanel>
          <form onSubmit={logWellnessData} className="bg-white p-6 shadow-md rounded-lg max-w-lg mx-auto">
            <h2 className="text-xl font-semibold text-center text-purple-600 mb-4">🧘 Log Wellness Data</h2>
            <input type="number" name="sleepHours" value={wellnessData.sleepHours} onChange={handleWellnessChange} placeholder="Hours Slept" className="p-2 border rounded w-full mb-3" />
            <input type="number" name="hydrationLevel" value={wellnessData.hydrationLevel} onChange={handleWellnessChange} placeholder="Water Intake (L)" className="p-2 border rounded w-full mb-3" />
            <input type="number" name="moodScore" value={wellnessData.moodScore} onChange={handleWellnessChange} placeholder="Mood Score (1-10)" className="p-2 border rounded w-full mb-3" />
            <input type="number" name="screenTime" value={wellnessData.screenTime} onChange={handleWellnessChange} placeholder="Screen Time (hrs)" className="p-2 border rounded w-full mb-3" />
            <button type="submit" className="bg-purple-500 text-white py-2 rounded w-full">💾 Log Wellness Data</button>
          </form>
        </TabPanel>

        {/* 📊 Analytics Tab */}
        
        <TabPanel>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold">📊 Fitness Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fitnessChartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="steps" stroke="#0088FE" />
                  <Line type="monotone" dataKey="workouts" stroke="#FF8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold">🧘 Wellness Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={wellnessChartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sleep" fill="#00C49F" />
                  <Bar dataKey="hydration" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold">🥧 Activity Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} label>
                    {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div
            >
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold">🏋️‍♂️ Fitness Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fitnessChartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="steps" stroke="#0088FE" />
                  <Line type="monotone" dataKey="workouts" stroke="#FF8042" />
                </LineChart>
                
              </ResponsiveContainer>
            </div>
          </div>
          </div>
        
          
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default LogHealthData;

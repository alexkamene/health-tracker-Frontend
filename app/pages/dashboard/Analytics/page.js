"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";
import { FiSave, FiTrash2, FiDownload, FiFilter } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Papa from "papaparse"; // For CSV export

const COLORS = ["#4C51BF", "#38A169", "#D69E2E", "#E53E3E", "#8B5CF6", "#EC4899"]; // Indigo, Green, Yellow, Red, Purple, Pink

const AnalyticsDashboard = () => {
  const [healthData, setHealthData] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fitnessView, setFitnessView] = useState("line"); // Toggle between 'line' and 'bar'
  const [loading, setLoading] = useState(false);

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";

    try {
      const healthResponse = await axios.get("http://localhost:3000/healthdata", {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
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
        username: profileResponse.data.username || "User",
        email: profileResponse.data.email || "user@example.com",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data.", { position: "top-right" });
    }
  };

  // Filter Data
  const filteredHealthData = healthData.filter((entry) => {
    const date = new Date(entry.loggedAt);
    return (!startDate || date >= new Date(startDate)) && (!endDate || date <= new Date(endDate));
  });

  // Chart Data Preparation
  const fitnessChartData = filteredHealthData.map((entry) => ({
    date: new Date(entry.loggedAt).toLocaleDateString(),
    steps: entry.steps || 0,
    workouts: entry.workouts || 0,
    calories: entry.caloriesBurned || 0,
  }));

  const wellnessChartData = filteredHealthData.map((entry) => ({
    date: new Date(entry.loggedAt).toLocaleDateString(),
    sleep: entry.sleepHours || 0,
    hydration: entry.hydrationLevel || 0,
    mood: entry.moodScore || 0,
  }));

  const pieData = [
    { name: "Steps", value: fitnessChartData.reduce((sum, d) => sum + d.steps, 0) },
    { name: "Workouts", value: fitnessChartData.reduce((sum, d) => sum + d.workouts, 0) },
    { name: "Calories", value: fitnessChartData.reduce((sum, d) => sum + d.calories, 0) },
  ].filter(d => d.value > 0);

  const radialData = [
    { name: "Steps", value: Math.min((fitnessChartData.reduce((sum, d) => sum + d.steps, 0) / 100000) * 100, 100), fill: COLORS[0] },
    { name: "Sleep", value: Math.min((filteredHealthData.reduce((sum, d) => sum + (d.sleepHours || 0), 0) / (filteredHealthData.length * 8)) * 100, 100), fill: COLORS[1] },
  ];

  // Stats Summary
  const stats = {
    avgSteps: fitnessChartData.length > 0 ? (fitnessChartData.reduce((sum, d) => sum + d.steps, 0) / fitnessChartData.length).toFixed(0) : 0,
    totalCalories: fitnessChartData.reduce((sum, d) => sum + d.calories, 0),
    avgSleep: filteredHealthData.length > 0 ? (filteredHealthData.reduce((sum, d) => sum + (d.sleepHours || 0), 0) / filteredHealthData.length).toFixed(1) : 0,
  };

  // Delete Health Data
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/healthdata/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHealthData(healthData.filter((data) => data._id !== id));
      toast.success("Entry deleted!", { position: "top-right" });
    } catch (error) {
      console.error("Error deleting health data:", error);
      toast.error("Failed to delete entry.", { position: "top-right" });
    }
  };

  // Export Functions
  const downloadPDF = () => {
    const element = document.getElementById("dashboard-content");
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save(`Health_Dashboard_${profile.username}.pdf`);
      toast.success("PDF downloaded!", { position: "top-right" });
    });
  };

  const downloadCSV = () => {
    const csvData = filteredHealthData.map((entry) => ({
      Date: new Date(entry.loggedAt).toLocaleDateString(),
      Steps: entry.steps || 0,
      Workouts: entry.workouts || 0,
      Calories: entry.caloriesBurned || 0,
      Sleep: entry.sleepHours || 0,
      Hydration: entry.hydrationLevel || 0,
      Mood: entry.moodScore || 0,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Health_Dashboard_${profile.username}.csv`;
    link.click();
    toast.success("CSV downloaded!", { position: "top-right" });
  };

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
      <div className="relative z-10 max-w-7xl mx-auto" id="dashboard-content">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 animate-fade-in-down">
          Welcome, <span className="text-green-600">{profile.username}</span>!
        </h1>

        {/* Filters */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mb-6 animate-fade-in-up">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">📅 Filter Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={fetchData}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
            >
              <FiFilter /> Apply Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">👤 Your Profile</h2>
            <div className="flex items-center gap-4 mb-4">
              <img src="https://via.placeholder.com/80" alt="Profile" className="w-20 h-20 rounded-full border-2 border-green-500" />
              <div>
                <p className="text-lg font-semibold text-gray-900">{profile.username}</p>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-green-600">📊 Quick Stats</h2>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-semibold text-indigo-600">Avg Steps:</span> {stats.avgSteps}</p>
              <p><span className="font-semibold text-indigo-600">Total Calories:</span> {stats.totalCalories} kcal</p>
              <p><span className="font-semibold text-indigo-600">Avg Sleep:</span> {stats.avgSleep} hrs</p>
            </div>
          </div>

          {/* Progress Radial Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">🎯 Progress Overview</h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" barSize={10} data={radialData}>
                <RadialBar minAngle={15} background clockWise dataKey="value" />
                <Legend />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          {/* Fitness Progress Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg md:col-span-2 animate-slide-in-left">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-600">🏃‍♂️ Fitness Progress</h2>
              <button
                onClick={() => setFitnessView(fitnessView === "line" ? "bar" : "line")}
                className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg hover:bg-gray-300 transition-all"
              >
                Switch to {fitnessView === "line" ? "Bar" : "Line"}
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {fitnessView === "line" ? (
                <LineChart data={fitnessChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                  <Legend />
                  <Line type="monotone" dataKey="steps" stroke={COLORS[0]} name="Steps" />
                  <Line type="monotone" dataKey="workouts" stroke={COLORS[3]} name="Workouts" />
                  <Line type="monotone" dataKey="calories" stroke={COLORS[2]} name="Calories" />
                </LineChart>
              ) : (
                <BarChart data={fitnessChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                  <Legend />
                  <Bar dataKey="steps" fill={COLORS[0]} name="Steps" />
                  <Bar dataKey="workouts" fill={COLORS[3]} name="Workouts" />
                  <Bar dataKey="calories" fill={COLORS[2]} name="Calories" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Wellness Area Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">🧘 Wellness Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={wellnessChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                <Legend />
                <Area type="monotone" dataKey="sleep" stroke={COLORS[1]} fillOpacity={0.3} fill={COLORS[1]} name="Sleep" />
                <Area type="monotone" dataKey="hydration" stroke={COLORS[2]} fillOpacity={0.3} fill={COLORS[2]} name="Hydration" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Mood Scatter Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">😊 Mood Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" name="Date" />
                <YAxis dataKey="mood" stroke="#6B7280" name="Mood" domain={[0, 10]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                <Legend />
                <Scatter name="Mood Score" data={wellnessChartData} fill={COLORS[5]} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Breakdown Pie */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h2 className="text-xl font-semibold mb-4 text-green-600">🥧 Activity Breakdown</h2>
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

          {/* Health Data Table */}
          <div className="bg-white p-6 rounded-2xl shadow-lg md:col-span-2 animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">📅 Health Data Log</h2>
            {filteredHealthData.length === 0 ? (
              <p className="text-gray-500 text-center">No data recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <tr>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Steps</th>
                      <th className="p-3 text-left">Sleep</th>
                      <th className="p-3 text-left">Calories</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHealthData.slice(0, 5).map((data) => (
                      <tr key={data._id} className="hover:bg-indigo-50 transition-all">
                        <td className="p-3 border-b border-gray-200">{new Date(data.loggedAt).toLocaleDateString()}</td>
                        <td className="p-3 border-b border-gray-200">{data.steps?.toLocaleString() || 0}</td>
                        <td className="p-3 border-b border-gray-200">{data.sleepHours || 0}</td>
                        <td className="p-3 border-b border-gray-200">{data.caloriesBurned || 0}</td>
                        <td className="p-3 border-b border-gray-200">
                          <button onClick={() => handleDelete(data._id)} className="text-red-500 hover:text-red-600">
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Journal Entries */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right max-h-64 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">📝 Recent Journal Entries</h2>
            {journalEntries.length === 0 ? (
              <p className="text-gray-500 text-center">No entries yet.</p>
            ) : (
              journalEntries.slice(0, 3).map((entry) => (
                <div key={entry._id} className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <p>{new Date(entry.date).toLocaleDateString()}</p>
                    <p>{new Date(entry.date).toLocaleTimeString()}</p>
                  </div>
                  <p className="text-gray-700">{entry.entry.substring(0, 100)}...</p>
                </div>
              ))
            )}
          </div>

          {/* Calendar */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">📅 Activity Calendar</h2>
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
              className="border-none w-full text-gray-700"
              tileClassName={({ date }) => {
                const entryDates = journalEntries.map((e) => new Date(e.date).toDateString());
                return entryDates.includes(date.toDateString()) ? "bg-green-100 rounded-full" : null;
              }}
            />
          </div>

          {/* Export Options */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h2 className="text-xl font-semibold mb-4 text-green-600">📊 Export Data</h2>
            <div className="space-y-4">
              <button
                onClick={downloadPDF}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105"
              >
                <FiDownload /> PDF
              </button>
              <button
                onClick={downloadCSV}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
              >
                <FiDownload /> CSV
              </button>
            </div>
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

export default AnalyticsDashboard;
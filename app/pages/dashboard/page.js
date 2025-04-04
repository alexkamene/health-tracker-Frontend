"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  LineChart, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiDownload, FiFilter, FiShield } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withAuth from "@/app/utils/withauth";
import { useRouter } from "next/navigation";

const COLORS = ["#4C51BF", "#38A169", "#D69E2E", "#E53E3E"]; // Indigo, Green, Yellow, Red

const Dashboard = () => {
  const [healthData, setHealthData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [username, setUsername] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [show2FAWarning, setShow2FAWarning] = useState(false);
  const [stepsPercentageChange, setStepsPercentageChange] = useState(0);
  const [caloriesPercentageChange, setCaloriesPercentageChange] = useState(0);
  const reportRef = useRef();
  const router = useRouter();

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "User");
    fetchHealthData();
    fetchInsights();
    checkReminder();
    check2FAStatus();
  }, []);

  const checkReminder = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    if (day === 0 && hour >= 18) setShowReminder(true);
  };

  const check2FAStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data.twoFactorEnabled) {
        setShow2FAWarning(true);
      }
    } catch (error) {
      console.error("❌ Error checking 2FA status:", error);
      toast.error("Failed to verify account security.", { position: "top-right" });
    }
  };

  const fetchHealthData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/healthdata", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setHealthData(data);

      // Calculate activity counts for pie chart
      const activityCounts = { Walking: 0, Running: 0, Cycling: 0, Other: 0 };
      data.forEach((entry) => {
        if (entry.activityType && activityCounts[entry.activityType] !== undefined) {
          activityCounts[entry.activityType] += 1;
        }
      });
      setPieData(
        Object.keys(activityCounts).map((activity) => ({
          name: activity,
          value: activityCounts[activity],
        }))
      );

      // Calculate percentage changes
      calculatePercentageChanges(data);
    } catch (error) {
      console.error("❌ Error fetching health data:", error);
      toast.error("Failed to load health data.", { position: "top-right" });
    }
  };

  const calculatePercentageChanges = (data) => {
    if (!data || data.length < 2) {
      setStepsPercentageChange(0);
      setCaloriesPercentageChange(0);
      return;
    }

    // Define the current and previous periods (e.g., last 7 days vs. previous 7 days)
    const now = new Date();
    const currentPeriodStart = new Date(now);
    currentPeriodStart.setDate(now.getDate() - 7); // Last 7 days
    const previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(currentPeriodStart.getDate() - 7); // Previous 7 days

    // Filter data for the current period
    const currentPeriodData = data.filter((entry) => {
      const entryDate = new Date(entry.loggedAt);
      return entryDate >= currentPeriodStart && entryDate <= now;
    });

    // Filter data for the previous period
    const previousPeriodData = data.filter((entry) => {
      const entryDate = new Date(entry.loggedAt);
      return entryDate >= previousPeriodStart && entryDate < currentPeriodStart;
    });

    // Calculate total steps for both periods
    const currentSteps = currentPeriodData.reduce((sum, entry) => sum + entry.steps, 0);
    const previousSteps = previousPeriodData.reduce((sum, entry) => sum + entry.steps, 0);

    // Calculate total calories burned for both periods
    const currentCalories = currentPeriodData.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
    const previousCalories = previousPeriodData.reduce((sum, entry) => sum + entry.caloriesBurned, 0);

    // Calculate percentage change for steps
    let stepsChange = 0;
    if (previousSteps > 0) {
      stepsChange = ((currentSteps - previousSteps) / previousSteps) * 100;
    } else if (currentSteps > 0) {
      stepsChange = 100; // If previous period has 0 steps, treat as 100% increase
    }
    setStepsPercentageChange(stepsChange.toFixed(1));

    // Calculate percentage change for calories
    let caloriesChange = 0;
    if (previousCalories > 0) {
      caloriesChange = ((currentCalories - previousCalories) / previousCalories) * 100;
    } else if (currentCalories > 0) {
      caloriesChange = 100; // If previous period has 0 calories, treat as 100% increase
    }
    setCaloriesPercentageChange(caloriesChange.toFixed(1));
  };

  const fetchInsights = async () => {
    const token = localStorage.getItem("token");
    setLoadingInsights(true);
    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/api/healthinsights", {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
      });
      setInsights(response.data);
      toast.success("Insights loaded successfully!", { position: "top-right" });
    } catch (error) {
      console.error("❌ Error fetching health insights:", error);
      toast.error("Failed to load insights.", { position: "top-right" });
    } finally {
      setLoadingInsights(false);
    }
  };

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(34, 139, 87);
      pdf.text("Health Insights Report", 10, 15);
      pdf.setFontSize(12);
      pdf.setTextColor(55, 65, 81);
      pdf.text(`Generated for: ${username}`, 10, 25);
      pdf.text(`Date Range: ${startDate || "All Time"} to ${endDate || "Today"}`, 10, 35);
      pdf.addImage(imgData, "PNG", 10, 40, 190, 90);
      pdf.save(`Health_Insights_${username}.pdf`);
      toast.success("Report downloaded!", { position: "top-right" });
      setShowReminder(false);
    });
  };

  const leaderboardData = [
    { name: "You", steps: healthData.reduce((sum, entry) => sum + entry.steps, 0) },
    { name: "John Doe", steps: 15000 },
    { name: "Jane Smith", steps: 12000 },
    { name: "Alex Brown", steps: 9000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-green-50 to-purple-50 p-6 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="absolute inset-0 z-0">
        <div className="w-80 h-80 bg-indigo-200 rounded-full absolute top-10 left-10 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-green-200 rounded-full absolute bottom-20 right-20 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 animate-fade-in-down">
          Welcome, <span className="text-green-600">{username}</span>!
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Steps", value: healthData.reduce((sum, entry) => sum + entry.steps, 0), color: "text-indigo-600", bg: "bg-indigo-50" },
            { title: "Calories Burned", value: `${healthData.reduce((sum, entry) => sum + entry.caloriesBurned, 0)} kcal`, color: "text-green-600", bg: "bg-green-50" },
            { title: "Average Sleep", value: `${healthData.length > 0 ? (healthData.reduce((sum, entry) => sum + entry.sleepHours, 0) / healthData.length).toFixed(1) : 0} hrs`, color: "text-yellow-600", bg: "bg-yellow-50" },
            { title: "Average Heart Rate", value: `${insights ? insights.avgHeartRate : "N/A"} BPM`, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat, index) => (
            <div
              key={stat.title}
              className={`${stat.bg} p-6 rounded-2xl shadow-lg text-center transform transition-all duration-300 hover:shadow-xl animate-slide-in-${index % 2 === 0 ? "left" : "right"}`}
            >
              <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Fitness Meal Progress Circle */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 animate-fade-in-up">
          <h3 className="text-xl font-semibold mb-4 text-green-600">🍽️ Fitness Meal</h3>
          <div className="flex items-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke="#38A169"
                  strokeWidth="2"
                  strokeDasharray={`${(caloriesPercentageChange > 0 ? caloriesPercentageChange : 0)}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl font-bold">
                  {healthData.reduce((sum, entry) => sum + entry.caloriesBurned, 0)} kcal
                </p>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-gray-600">Calories Burned</p>
              <p className={`text-${caloriesPercentageChange >= 0 ? "green" : "red"}-600`}>
                {caloriesPercentageChange >= 0 ? "+" : ""}{caloriesPercentageChange}%
              </p>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 animate-fade-in-up">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">📅 Filter Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 transition-all duration-300"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 transition-all duration-300"
            />
          </div>
          <button
            onClick={fetchInsights}
            className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
            disabled={loadingInsights}
          >
            {loadingInsights ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading...
              </span>
            ) : (
              <>
                <FiFilter /> Get Insights
              </>
            )}
          </button>
        </div>

        {/* AI-Powered Insights */}
        <div ref={reportRef} className="bg-white p-6 rounded-2xl shadow-lg mb-8 animate-fade-in-up">
          <h3 className="text-xl font-semibold mb-4 text-purple-600">🔍 Health Insights</h3>
          {insights ? (
            <div className="text-gray-700">
              <p><span className="font-semibold text-indigo-600">Total Steps:</span> {(insights?.totalSteps ?? 0).toLocaleString()}</p>
              <p><span className="font-semibold text-indigo-600">Average Sleep:</span> {insights.avgSleep} hrs</p>
              <p><span className="font-semibold text-indigo-600">Average Heart Rate:</span> {insights.avgHeartRate} BPM</p>
              <p className="mt-2 text-green-600"><span className="font-semibold">Recommendation:</span> {insights.recommendation}</p>
            </div>
          ) : (
            <p className="text-gray-500">Select a date range to view insights...</p>
          )}
        </div>

        {/* Download Report Button */}
        <button
          onClick={downloadPDF}
          className="w-full max-w-xs mx-auto bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105 mb-8 animate-fade-in-up"
        >
          <FiDownload /> Download Report
        </button>

        {/* Reminder Modal */}
        {showReminder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center animate-slide-in-up">
              <h2 className="text-xl font-semibold text-green-600">📅 Weekly Health Report</h2>
              <p className="text-gray-600 mt-2">It’s Sunday evening – time to download your weekly health report!</p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={downloadPDF}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
                >
                  Download Now
                </button>
                <button
                  onClick={() => setShowReminder(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2FA Warning Modal */}
        {show2FAWarning && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center animate-slide-in-up">
              <h2 className="text-xl font-semibold text-red-600 flex items-center justify-center gap-2">
                <FiShield /> Secure Your Account
              </h2>
              <p className="text-gray-600 mt-2">
                Your account isn’t protected with Two-Factor Authentication (2FA). Enable it now for added security!
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => router.push("/Enabl2Fauth")}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
                >
                  Enable 2FA
                </button>
                <button
                  onClick={() => setShow2FAWarning(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Graphs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fitness Progress with Activity Trends */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">🏃 Fitness Progress</h3>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🏃</span>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {healthData.reduce((sum, entry) => sum + entry.steps, 0).toLocaleString()}
                </p>
                <p className="text-gray-600">Total Steps</p>
              </div>
            </div>
            <div className="text-gray-600 text-sm mb-4">
              <p>
                Progress: <span className={`text-${stepsPercentageChange >= 0 ? "green" : "red"}-600`}>
                  {stepsPercentageChange >= 0 ? "+" : ""}{stepsPercentageChange}%
                </span>
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">Activity Trends</h4>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={healthData}>
                  <Line type="monotone" dataKey="steps" stroke="#38A169" dot={false} />
                  <XAxis dataKey="loggedAt" tickFormatter={(date) => new Date(date).toLocaleDateString()} stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Health Progress */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">📈 Health Progress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="loggedAt" tickFormatter={(date) => new Date(date).toLocaleDateString()} stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                <Legend />
                <Line type="monotone" dataKey="steps" stroke={COLORS[0]} name="Steps" />
                <Line type="monotone" dataKey="caloriesBurned" stroke={COLORS[1]} name="Calories" />
                <Line type="monotone" dataKey="sleepHours" stroke={COLORS[2]} name="Sleep" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Workout Types */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h3 className="text-lg font-semibold mb-4 text-green-600">🏋️ Workout Types</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sleep & Calories */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h3 className="text-lg font-semibold mb-4 text-purple-600">⏳ Sleep & Calories</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={healthData}>
                <XAxis dataKey="loggedAt" tickFormatter={(date) => new Date(date).toLocaleDateString()} stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                <Legend />
                <Area type="monotone" dataKey="sleepHours" stroke={COLORS[0]} fillOpacity={0.3} fill={COLORS[0]} />
                <Area type="monotone" dataKey="caloriesBurned" stroke={COLORS[2]} fillOpacity={0.3} fill={COLORS[2]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Steps */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h3 className="text-lg font-semibold mb-4 text-yellow-600">🏃 Daily Steps</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={healthData}>
                <XAxis dataKey="loggedAt" tickFormatter={(date) => new Date(date).toLocaleDateString()} stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                <Bar dataKey="steps" fill={COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Mental Health */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h3 className="text-lg font-semibold mb-4 text-purple-600">🧠 Mental Health</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={healthData}>
                <Line type="monotone" dataKey="steps" stroke="#38A169" dot={false} />
                <XAxis dataKey="loggedAt" tickFormatter={(date) => new Date(date).toLocaleDateString()} stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-green-600 text-sm mt-2">High Flow</p>
          </div>

          {/* Mental Lethargy */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right  md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-purple-600">😴 Mental Lethargy</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={healthData}>
                <Line type="monotone" dataKey="sleepHours" stroke="#38A169" dot={false} />
                <XAxis dataKey="loggedAt" tickFormatter={(date) => new Date(date).toLocaleDateString()} stroke="#6B7280" />
                <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        
        </div>
      </div>

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
        .animate-fade-in { animation: fadeInUp 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default withAuth(Dashboard);
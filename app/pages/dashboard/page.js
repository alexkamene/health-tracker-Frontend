"use client";
import { useEffect, useState,useRef  } from "react";
import axios from "axios";
import { 
  LineChart, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const Dashboard = () => {
  const [healthData, setHealthData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [username, setUsername] = useState("");
  const reportRef = useRef();
  const [showReminder, setShowReminder] = useState(false);


  useEffect(() => {
    setUsername(localStorage.getItem("username") || "User");
    fetchHealthData();
    fetchInsights();
    checkReminder()
  }, []);

// ✅ Function to Check if Today is Sunday at 6 PM
const checkReminder = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();

  if (day === 0 && hour >= 18) { // Sunday at 6 PM
    setShowReminder(true);
  }
};
  const fetchInsights = async () => {
    const token = localStorage.getItem("token");
    if (!token)
      window.location.href = "/login";

    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/api/healthinsights", {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate }
      });
      setInsights(response.data);
    } catch (error) {
      console.error("❌ Error fetching health insights:", error);
    }
  };
   // ✅ Function to Generate PDF
   const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("Health Insights Report", 10, 15);
      
      pdf.setFontSize(12);
      pdf.text(`Generated for: ${username}`, 10, 25);
      pdf.text(`Date Range: ${startDate || "All Time"} to ${endDate || "Today"}`, 10, 35);

      pdf.addImage(imgData, "PNG", 10, 40, 190, 90);
      pdf.save(`Health_Insights_${username}.pdf`);
      setShowReminder(false);
    });
  };

  const fetchHealthData = async () => {
    const token = localStorage.getItem("token");
    if (!token) 
      window.location.href = "/login";

    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/healthdata", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHealthData(response.data);

      // ✅ Aggregate Activity Data for Pie Chart
      const activityCounts = { Walking: 0, Running: 0, Cycling: 0, Other: 0 };
      response.data.forEach(entry => {
        if (entry.activityType && activityCounts[entry.activityType] !== undefined) {
          activityCounts[entry.activityType] += 1;
        }
      });

      setPieData(Object.keys(activityCounts).map(activity => ({
        name: activity, value: activityCounts[activity]
      })));

    } catch (error) {
      console.error("❌ Error fetching health data:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 grid-cols-2 gap-6 p-6">
          <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold text-gray-600">Total Steps</h3>
            <p className="text-3xl font-bold text-[#0088FE]">
              {healthData.reduce((sum, entry) => sum + entry.steps, 0)}
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold text-gray-600">Calories Burned</h3>
            <p className="text-3xl font-bold text-[#00C49F]">
              {healthData.reduce((sum, entry) => sum + entry.caloriesBurned, 0)} kcal
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold text-gray-600">Average Sleep</h3>
            <p className="text-3xl font-bold text-[#FFBB28]">
              {healthData.length > 0 ? (healthData.reduce((sum, entry) => sum + entry.sleepHours, 0) / healthData.length).toFixed(1) : 0} hrs
            </p>
          </div>

          
        </div>
          {/* Date Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-2">📅 Select Date Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
        </div>
        <button onClick={fetchInsights} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
          🔍 Get Insights
        </button>
      </div>
        
             {/* AI-Powered Insights */}
      <div ref={reportRef} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-2">🔍 AI Health Insights</h3>
        {insights ? (
          <div>
            <p><strong>Total Steps (Selected Period):</strong> {insights.totalSteps}</p>
            <p><strong>Average Sleep:</strong> {insights.avgSleep} hrs</p>
            <p><strong>Average Heart Rate:</strong> {insights.avgHeartRate} BPM</p>
            <p className="mt-2 text-blue-600"><strong>Recommendation:</strong> {insights.recommendation}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading insights...</p>
        )}
      </div>
      
      {/* ✅ Download Report Button */}
      <button
        onClick={downloadPDF}
        className="px-4 py-2  w-64 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Download Report as PDF
      </button>
      {showReminder && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">📅 Weekly Health Report</h2>
            <p className="text-gray-600">It’s time to download your health report for this week!</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button onClick={downloadPDF} className="px-4 py-2 width-32  bg-blue-500 text-white rounded-lg">
                Download Report
              </button>
              <button onClick={() => setShowReminder(false)} className="px-4 py-2 bg-gray-300 rounded-lg">
              Cancel
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Graphs Section */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 p-6">
          
          {/* Line Chart - Steps, Calories, Sleep */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">📈 Health Progress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="loggedAt" tickFormatter={date => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="steps" stroke="#0088FE" name="Steps" />
                <Line type="monotone" dataKey="caloriesBurned" stroke="#00C49F" name="Calories Burned" />
                <Line type="monotone" dataKey="sleepHours" stroke="#FFBB28" name="Sleep Hours" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Workout Types */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">🏋️ Workout Types</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Area Chart - Sleep & Calories */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">⏳ Sleep & Calories Burned</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={healthData}>
                <XAxis dataKey="loggedAt" tickFormatter={date => new Date(date).toLocaleDateString()} />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="sleepHours" stroke="#0088FE" fillOpacity={0.5} fill="#0088FE" />
                <Area type="monotone" dataKey="caloriesBurned" stroke="#FFBB28" fillOpacity={0.5} fill="#FFBB28" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Daily Steps */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">🏃 Daily Steps</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={healthData}>
                <XAxis dataKey="loggedAt" tickFormatter={date => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="steps" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

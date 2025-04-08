"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiPlus, FiTrash2, FiSearch, FiDownload } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Papa from "papaparse"; // For CSV export

const COLORS = ["#4C51BF", "#38A169", "#D69E2E", "#E53E3E", "#8B5CF6", "#EC4899"]; // Indigo, Green, Yellow, Red, Purple, Pink

const AnalyticsDashboard = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [meals, setMeals] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [weeklySleep, setWeeklySleep] = useState([]);
  const [token, setToken] = useState("");
  const [activeMeal, setActiveMeal] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchMeals(storedToken);
      fetchExercises(storedToken);
      fetchSleepData(storedToken);
    } else {
      window.location.href = "/login";
    }
  }, []);

  // Fetch meals
  const fetchMeals = async (token) => {
    try {
      const res = await axios.get("https://heath-tracker-backend.onrender.com/api/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals(res.data);
    } catch (err) {
      console.error("Failed to fetch meals:", err);
      toast.error("Failed to load meals!", { position: "top-right" });
    }
  };

  // Fetch exercises
  const fetchExercises = async (token) => {
    try {
      const res = await axios.get("https://heath-tracker-backend.onrender.com/my-exercises", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(res.data);
    } catch (err) {
      console.error("Error fetching exercises:", err);
      toast.error("Failed to load exercises!", { position: "top-right" });
    }
  };

  // Fetch sleep data
  const fetchSleepData = async (token) => {
    try {
      const res = await axios.get("https://heath-tracker-backend.onrender.com/sleep/week", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklySleep(res.data.reverse());
    } catch (err) {
      console.error("Failed to fetch sleep data:", err);
      toast.error("Failed to fetch sleep data!", { position: "top-right" });
    }
  };

  // Search food
  const searchFood = async () => {
    if (!query) return toast.warn("Enter a food to search!", { position: "top-right" });
    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/search", { params: { query } });
      setResults(response.data.hints || []);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed!", { position: "top-right" });
    }
  };

  // Add meal with quantity
  const addToMeal = async (foodName, calories, mealType, quantity = 1) => {
    try {
      await axios.post(
        "https://heath-tracker-backend.onrender.com/add",
        {
          foodName,
          calories: Math.round(calories * quantity),
          quantity,
          mealType,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Food added successfully!", { position: "top-right" });
      fetchMeals(token);
      setResults([]);
      setQuery("");
    } catch (error) {
      console.error("Add to meal failed:", error);
      toast.error("Error adding food!", { position: "top-right" });
    }
  };

  // Update meal quantity
  const updateMealQuantity = async (id, newQuantity) => {
    try {
      await axios.put(
        `https://heath-tracker-backend.onrender.com/update/${id}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Quantity updated!", { position: "top-right" });
      fetchMeals(token);
    } catch (err) {
      console.error("Failed to update quantity:", err);
      toast.error("Failed to update quantity!", { position: "top-right" });
    }
  };

  // Delete meal
  const deleteMeal = async (id) => {
    try {
      await axios.delete(`https://heath-tracker-backend.onrender.com/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Meal removed!", { position: "top-right" });
      fetchMeals(token);
    } catch (err) {
      console.error("Failed to delete meal:", err);
      toast.error("Failed to remove meal!", { position: "top-right" });
    }
  };

  // Calculate totals and analytics
  const totalCaloriesConsumed = meals.reduce((total, meal) => total + meal.calories, 0);
  const today = new Date().toLocaleDateString();
  const todayExercises = exercises.filter(
    (ex) => new Date(ex.date).toLocaleDateString() === today
  );
  const exerciseCalories = todayExercises.reduce(
    (total, ex) => total + (ex.caloriesBurned || 0),
    0
  );
  const netCalories = totalCaloriesConsumed - exerciseCalories;
  const totalMealsLogged = meals.length;

  // Sleep Insights Calculations
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

  const getQualityText = (score) => {
    if (score >= 80) return "Excellent 🌟";
    if (score >= 60) return "Good 👍";
    if (score >= 40) return "Fair 😐";
    return "Poor 😴";
  };

  // Recent Exercises
  const recentExercises = exercises
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const groupedMeals = meals.reduce((acc, meal) => {
    acc[meal.mealType] = acc[meal.mealType] || [];
    acc[meal.mealType].push(meal);
    return acc;
  }, {});

  const mealChartData = meals.map((meal) => ({
    foodName: meal.foodName,
    calories: meal.calories,
  }));

  const mealTypePieData = Object.keys(groupedMeals).map((type) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: groupedMeals[type].reduce((sum, meal) => sum + meal.calories, 0),
  }));

  const sleepChartData = weeklySleep.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    sleep: entry.duration,
  }));

  const quickAddOptions = [
    { label: "Apple (52 kcal)", foodName: "Apple", calories: 52 },
    { label: "Banana (89 kcal)", foodName: "Banana", calories: 89 },
    { label: "Chicken Breast (165 kcal)", foodName: "Chicken Breast", calories: 165 },
  ];

  // Export Functions
  const downloadPDF = () => {
    const element = document.getElementById("dashboard-content");
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("Health_Dashboard.pdf");
      toast.success("PDF downloaded!", { position: "top-right" });
    });
  };

  const downloadCSV = () => {
    const csvData = [
      ...meals.map((meal) => ({
        Type: "Meal",
        Name: meal.foodName,
        Calories: meal.calories,
        Date: new Date().toLocaleDateString(),
      })),
      ...exercises.map((ex) => ({
        Type: "Exercise",
        Name: ex.name || ex.exerciseType,
        Calories: ex.caloriesBurned,
        Date: new Date(ex.date).toLocaleDateString(),
      })),
      ...weeklySleep.map((sleep) => ({
        Type: "Sleep",
        Name: "Sleep Duration",
        Hours: sleep.duration,
        Date: new Date(sleep.date).toLocaleDateString(),
      })),
    ];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Health_Dashboard.csv";
    link.click();
    toast.success("CSV downloaded!", { position: "top-right" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-green-50 to-purple-50 p-4 md:p-6 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="w-80 h-80 bg-indigo-200 rounded-full absolute top-10 left-10 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-green-200 rounded-full absolute bottom-20 right-20 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto" id="dashboard-content">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 animate-fade-in-down">
          Your Health Analytics 🍽️🏃🛌
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h3 className="text-lg font-semibold text-indigo-600">Meals Logged</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalMealsLogged}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
            <h3 className="text-lg font-semibold text-green-600">Exercise Burned</h3>
            <p className="text-3xl font-bold text-green-600">{exerciseCalories} kcal</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
            <h3 className="text-lg font-semibold text-purple-600">Net Calories</h3>
            <p className="text-3xl font-bold text-purple-600">{netCalories} kcal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Exercises */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-4 text-green-600">🏋️ Recent Exercises</h2>
            {recentExercises.length > 0 ? (
              <ul className="space-y-3">
                {recentExercises.map((ex, idx) => (
                  <li key={idx} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{ex.name || ex.exerciseType}</p>
                      <p className="text-sm text-gray-600">
                        {ex.duration} mins | {ex.caloriesBurned} kcal
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(ex.date).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No exercises logged yet.</p>
            )}
          </div>

          {/* Sleep Insights */}
          {weeklySleep.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">🛌 Sleep Insights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Avg Sleep</p>
                  <p className="text-2xl font-bold text-indigo-600">{avgSleep.toFixed(1)} hrs</p>
                  <p className="text-sm text-gray-600">
                    {avgSleep >= 7 ? "✅ Optimal" : "⚠️ Needs Boost"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Sleep Score</p>
                  <p className="text-2xl font-bold text-indigo-600">{sleepScore}/100</p>
                  <p className="text-sm text-gray-600">{getQualityText(sleepScore)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Consistency</p>
                  <p className="text-2xl font-bold text-indigo-600">{sleepConsistency}%</p>
                  <p className="text-sm text-gray-600">Sleep Streak</p>
                </div>
              </div>
            </div>
          )}

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

          {/* Meal Tracker */}
          <div className="bg-white p-6 rounded-2xl shadow-lg md:col-span-2 animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-6 text-indigo-600">🍽️ Meal Tracker</h2>
            {["breakfast", "lunch", "dinner", "snacks"].map((type) => (
              <div key={type} className="mb-6">
                <div
                  className="flex justify-between items-center cursor-pointer bg-gray-100 p-3 rounded-md text-gray-700 hover:bg-gray-200 transition-all"
                  onClick={() => setActiveMeal(activeMeal === type ? null : type)}
                >
                  <h3 className="text-lg font-medium capitalize">{type}</h3>
                  <span className="text-gray-500">{activeMeal === type ? "▲" : "▼"}</span>
                </div>
                {activeMeal === type && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      {quickAddOptions.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => addToMeal(option.foodName, option.calories, type, 1)}
                          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-sm hover:bg-indigo-200 transition-all"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search food..."
                        className="border border-gray-300 rounded-md p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={searchFood}
                        className="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition-all"
                      >
                        <FiSearch />
                      </button>
                    </div>
                    {results.length > 0 && (
                      <div className="max-h-40 overflow-y-auto space-y-3 border border-gray-200 rounded-md p-3 bg-gray-50">
                        {results.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
                          >
                            <div>
                              <p className="font-medium text-gray-800">{item.food.label}</p>
                              <p className="text-sm text-gray-600">
                                {Math.round(item.food.nutrients.ENERC_KCAL) || 0} kcal
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                addToMeal(item.food.label, item.food.nutrients.ENERC_KCAL, type, 1)
                              }
                              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-all"
                            >
                              <FiPlus />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {groupedMeals[type]?.length > 0 ? (
                      <div className="space-y-3">
                        {groupedMeals[type].map((meal) => (
                          <div
                            key={meal._id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                          >
                            <div>
                              <p className="font-medium text-gray-800">{meal.foodName}</p>
                              <p className="text-sm text-gray-600">{meal.calories} kcal</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                value={meal.quantity}
                                onChange={(e) => updateMealQuantity(meal._id, e.target.value)}
                                className="w-16 border border-gray-300 rounded-md p-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                              <button
                                onClick={() => deleteMeal(meal._id)}
                                className="text-red-500 hover:text-red-600 transition-all"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center mt-2">No {type} added yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Meal Calorie Breakdown */}
          {meals.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">📊 Meal Calorie Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mealChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="foodName" interval={0} angle={-15} textAnchor="end" height={60} stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                  <Bar dataKey="calories" fill={COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Meal Type Distribution */}
          {meals.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
              <h2 className="text-xl font-semibold mb-4 text-green-600">🥧 Meal Type Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={mealTypePieData} cx="50%" cy="50%" outerRadius={100} label dataKey="value">
                    {mealTypePieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Sleep Trends */}
          {weeklySleep.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">🛌 Sleep Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sleepChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }} />
                  <Bar dataKey="sleep" fill={COLORS[1]} name="Sleep Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
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
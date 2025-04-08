"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FiPlus, FiTrash2, FiSearch } from "react-icons/fi";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [meals, setMeals] = useState([]);
  const [token, setToken] = useState("");
  const [activeMeal, setActiveMeal] = useState(null);
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [exerciseCalories, setExerciseCalories] = useState(0);
  const [goal, setGoal] = useState(null);
  const [target, setTarget] = useState("");
  const [type, setType] = useState("calories");
  const [frequency, setFrequency] = useState("daily");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
      fetchMeals(storedToken);
    } else {
      window.location.href = "/login";
    }
  }, []);

  // Fetch profile data
  const fetchProfile = async (token) => {
    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile raw response:", response.data);
      if (Array.isArray(response.data)) {
        console.error("Received array instead of object:", response.data);
        alert("⚠️ Profile data is invalid.");
        return;
      }
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error);
      alert("❌ Failed to load profile.");
    }
  };

  // Fetch meals
  const fetchMeals = async (token) => {
    try {
      const res = await axios.get("https://heath-tracker-backend.onrender.com/api/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Meals raw response:", res.data);
      setMeals(res.data);
    } catch (err) {
      console.error("Failed to fetch meals:", err);
      alert("❌ Failed to load meals.");
    }
  };

  // Search food
  const searchFood = async () => {
    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/search", {
        params: { query },
      });
      setResults(response.data.hints || []);
    } catch (error) {
      console.error("Search failed:", error);
      alert("❌ Search failed.");
    }
  };

  // Add meal
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
      alert("✅ Food added successfully!");
      fetchMeals(token);
      setResults([]);
      setQuery("");
    } catch (error) {
      console.error("Add to meal failed:", error);
      alert("❌ Error adding food.");
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
      alert("✅ Quantity updated!");
      fetchMeals(token);
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert("❌ Failed to update quantity.");
    }
  };

  // Delete meal
  const deleteMeal = async (id) => {
    try {
      await axios.delete(`https://heath-tracker-backend.onrender.com/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Meal removed!");
      fetchMeals(token);
    } catch (err) {
      console.error("Failed to delete meal:", err);
      alert("❌ Failed to remove meal.");
    }
  };

  // Handle goal saving
  const handleSaveGoal = async () => {
    if (!target) return alert("Please enter a target value.");
    try {
      await axios.post(
        "https://heath-tracker-backend.onrender.com/set-goal",
        { type, target: parseInt(target), frequency },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoal({ type, target: parseInt(target), frequency });
      alert("🎯 Goal saved successfully!");
    } catch (err) {
      console.error("Error saving goal:", err);
      alert("❌ Failed to save goal.");
    }
  };

  // Calculate totals
  const totalCaloriesConsumed = meals.reduce((total, meal) => total + meal.calories, 0);
  const netCalories = totalCaloriesConsumed - exerciseCalories;
  const progress = goal?.type === "calories" ? totalCaloriesConsumed : 0;
  const percentage = goal ? Math.min(((progress / goal.target) * 100).toFixed(1), 100) : 0;

  const groupedMeals = meals.reduce((acc, meal) => {
    acc[meal.mealType] = acc[meal.mealType] || [];
    acc[meal.mealType].push(meal);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Dashboard - <span className="text-blue-600">{profile.username || "User"}</span>
      </h1>

      {/* Profile */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Profile Overview</h2>
        <div className="flex items-center gap-4">
          <img
            src={profile.profilePic || "https://via.placeholder.com/60"}
            alt="Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">{profile.username || "Loading..."}</p>
            <p className="text-gray-600">{profile.email || "Loading..."}</p>
          </div>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Daily Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Consumed</p>
            <p className="text-lg font-semibold text-blue-600">{totalCaloriesConsumed} kcal</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Exercise Burned</p>
            <p className="text-lg font-semibold text-blue-600">{exerciseCalories} kcal</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Net Calories</p>
            <p className="text-lg font-semibold text-blue-600">{netCalories} kcal</p>
          </div>
        </div>
      </div>

      {/* Goal Setter */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Set Your Goal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="calories">Calories Consumed</option>
            <option value="exercise">Calories Burned</option>
          </select>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Target value"
          />
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <button
          onClick={handleSaveGoal}
          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
        >
          Save Goal
        </button>
      </div>

      {/* Goal Progress */}
      {goal && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Goal Progress</h2>
          <p className="text-gray-600 mb-2">
            {goal.type.toUpperCase()}: {progress} / {goal.target} ({percentage}%)
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Meal Tracker */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-medium text-gray-700 mb-6">Meal Tracker</h2>
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
                {/* Search Bar */}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search food..."
                    className="border border-gray-300 rounded-md p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={searchFood}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all"
                  >
                    <FiSearch />
                  </button>
                </div>

                {/* Search Results */}
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

                {/* Meals Table */}
                {groupedMeals[type]?.length > 0 ? (
                  <table className="w-full border-collapse text-gray-700">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left text-sm font-semibold">Food</th>
                        <th className="p-3 text-left text-sm font-semibold">Qty</th>
                        <th className="p-3 text-left text-sm font-semibold">Calories</th>
                        <th className="p-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedMeals[type].map((meal) => (
                        <tr key={meal._id} className="hover:bg-gray-50 transition-all">
                          <td className="p-3 border-b border-gray-200">{meal.foodName}</td>
                          <td className="p-3 border-b border-gray-200">
                            <input
                              type="number"
                              min="1"
                              value={meal.quantity}
                              onChange={(e) => updateMealQuantity(meal._id, e.target.value)}
                              className="border border-gray-300 rounded-md p-1 w-16 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-3 border-b border-gray-200">{meal.calories} kcal</td>
                          <td className="p-3 border-b border-gray-200">
                            <button
                              onClick={() => deleteMeal(meal._id)}
                              className="text-red-500 hover:text-red-600 transition-all"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center mt-2">No {type} added yet.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      {meals.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-medium text-gray-700 mb-6">Meal Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={meals}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="foodName"
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderColor: "#e5e7eb" }}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              />
              <Bar dataKey="calories" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
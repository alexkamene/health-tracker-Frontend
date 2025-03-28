"use client"


import { useEffect, useState } from "react";
import axios from "axios";

const UserXP = () => {
  const [user, setUser] = useState({ xp: 0, level: 1 });
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    const fetchXP = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://heath-tracker-backend.onrender.com/user/xp", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        setUser(response.data);
        setHealthData(response.data.lastEntry);
      } catch (error) {
        console.error("❌ Error fetching XP:", error);
      }
    };
    fetchXP();
  }, []);

  return (
    <div className="bg-blue-100 p-6 rounded-lg shadow-md mb-6 text-center">
      <h2 className="text-2xl font-bold text-blue-600">🎮 Your Progress</h2>
      <p><strong>Level:</strong> {user.level}</p>
      <p><strong>XP:</strong> {user.xp} XP</p>

      <div className="mt-3 bg-gray-200 rounded-full h-4 overflow-hidden">
        <div 
          className="bg-blue-500 h-4 text-center text-xs font-bold leading-4 text-white"
          style={{ width: `${(user.xp % 100)}%` }}
        >
          {(user.xp % 100)}%
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">Next level at {user.level * 100} XP</p>

      {healthData && (
        <div className="mt-4 text-left">
          <h3 className="font-bold text-gray-700">📊 Last Health Entry:</h3>
          <p><strong>Steps:</strong> {healthData.steps}</p>
          <p><strong>Workouts:</strong> {healthData.workouts} mins</p>
          <p><strong>Sleep:</strong> {healthData.sleepHours} hrs</p>
        </div>
      )}
    </div>
  );
};

export default UserXP;

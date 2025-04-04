"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiZap, FiStar, FiBarChart, FiRefreshCw } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserXP = () => {
  const [user, setUser] = useState({ xp: 0, level: 1 });
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchXP();
  }, []);

  const fetchXP = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) window.location.href = "/login";
      const response = await axios.get("https://heath-tracker-backend.onrender.com/user/xp", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setUser(response.data);
      setHealthData(response.data.lastEntry);
      toast.success("XP and health data loaded!", { position: "top-right" });
    } catch (error) {
      console.error("❌ Error fetching XP:", error);
      toast.error("Failed to fetch XP.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
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
      <div className="relative z-10 max-w-md mx-auto">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FiBarChart className="text-yellow-300 text-3xl animate-pulse" /> Your Progress
            </h2>
            <button
              onClick={fetchXP}
              disabled={loading}
              className={`p-2 rounded-full ${loading ? "bg-gray-500" : "bg-yellow-400 hover:bg-yellow-500"} text-gray-900 transition-all duration-300`}
              title="Refresh XP"
            >
              <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Level and XP */}
          <div className="text-center mb-6">
            <p className="text-lg">
              <strong className="text-yellow-200">⚡ Level:</strong>{" "}
              <span className="text-yellow-300 text-2xl font-bold">{user.level}</span>
            </p>
            <p className="text-lg mt-2">
              <strong className="text-green-200">🎯 XP:</strong>{" "}
              <span className="text-green-300 text-2xl font-bold">{user.xp} XP</span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-800 rounded-full h-6 overflow-hidden shadow-inner relative mb-4">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-green-400 text-center text-sm font-bold text-gray-900 transition-all duration-1000 ease-in-out"
              style={{ width: `${user.xp % 100}%` }}
            >
              {user.xp % 100}%
            </div>
          </div>
          <p className="text-sm text-gray-300 text-center italic">
            Next level at <span className="font-bold">{user.level * 100} XP</span>
          </p>

          {/* Last Health Entry */}
          {healthData && (
            <div className="mt-6 bg-white p-4 rounded-xl shadow-inner text-gray-900">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <FiStar className="text-indigo-500" /> Last Health Entry
              </h3>
              <div className="mt-2 space-y-2">
                <p>
                  <strong className="text-indigo-600">👟 Steps:</strong> {healthData.steps?.toLocaleString() || 0}
                </p>
                <p>
                  <strong className="text-green-600">🏋️ Workouts:</strong> {healthData.workouts || 0} mins
                </p>
                <p>
                  <strong className="text-purple-600">💤 Sleep:</strong> {healthData.sleepHours || 0} hrs
                </p>
              </div>
            </div>
          )}

          {/* Animated Overlay */}
          <div className="absolute inset-0 bg-white opacity-5 rounded-2xl blur-lg pointer-events-none"></div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default UserXP;
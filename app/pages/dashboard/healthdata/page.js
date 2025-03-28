"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiSave, FiTrash2 } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HealthTracker() {
  const [healthData, setHealthData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    weight: "",
    height: "",
    steps: "",
    sleepHours: "",
    workouts: "",
    heartRate: "",
    mentalHealthScore: "",
    caloriesBurned: "",
    activityType: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";

    try {
      const response = await axios.get("http://localhost:3000/healthdata", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHealthData(response.data);
    } catch (error) {
      console.error("❌ Error fetching health data:", error);
      toast.error("Failed to load health data.", { position: "top-right" });
    }
  };

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post("http://localhost:3000/healthdata", newEntry, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("🎉 Health data logged successfully!", { position: "top-right" });
      setNewEntry({
        weight: "",
        height: "",
        steps: "",
        sleepHours: "",
        workouts: "",
        heartRate: "",
        mentalHealthScore: "",
        caloriesBurned: "",
        activityType: "",
      });
      fetchHealthData();
    } catch (error) {
      console.error("❌ Error logging health data:", error);
      toast.error("Failed to log health data.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/healthdata/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHealthData(healthData.filter((data) => data._id !== deleteId));
      setShowDeleteModal(false);
      toast.success("Entry deleted successfully!", { position: "top-right" });
    } catch (error) {
      console.error("❌ Error deleting health data:", error);
      toast.error("Failed to delete entry.", { position: "top-right" });
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
      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 animate-fade-in-down">
          <span className="text-green-600">📊 Health Tracker</span>
        </h1>

        {/* Health Data Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8 transform transition-all duration-300 hover:shadow-xl animate-fade-in-up"
        >
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">Log Your Health Data</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "weight", placeholder: "Weight (kg)", type: "number" },
              { name: "height", placeholder: "Height (cm)", type: "number" },
              { name: "steps", placeholder: "Steps", type: "number" },
              { name: "sleepHours", placeholder: "Sleep (hrs)", type: "number" },
              { name: "workouts", placeholder: "Workouts (mins)", type: "number" },
              { name: "heartRate", placeholder: "Heart Rate (BPM)", type: "number" },
              { name: "mentalHealthScore", placeholder: "Mental Health (1-10)", type: "number" },
              { name: "caloriesBurned", placeholder: "Calories Burned", type: "number" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                value={newEntry[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300"
                required={field.name === "weight"}
              />
            ))}
            <select
              name="activityType"
              value={newEntry.activityType}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 bg-white transition-all duration-300"
            >
              <option value="">Select Activity</option>
              <option value="Walking">Walking</option>
              <option value="Running">Running</option>
              <option value="Cycling">Cycling</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <FiSave /> Add Data
              </>
            )}
          </button>
        </form>

        {/* Logged Health Data */}
        <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
          <h3 className="text-xl font-semibold mb-4 text-purple-600">📅 Your Health Records</h3>
          {healthData.length === 0 ? (
            <p className="text-gray-500 text-center animate-fade-in">
              No data recorded yet – start tracking your health now!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <tr>
                    {[
                      "Date",
                      "Steps",
                      "Sleep (hrs)",
                      "Workouts (mins)",
                      "Calories Burned",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="p-3 text-left font-semibold border-b border-indigo-300"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {healthData.map((data, index) => (
                    <tr
                      key={data._id}
                      className={`text-gray-700 transition-all duration-300 hover:bg-indigo-50 animate-slide-in-${
                        index % 2 === 0 ? "left" : "right"
                      }`}
                    >
                      <td className="p-3 border-b border-gray-200">
                        {new Date(data.loggedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {data.steps.toLocaleString()}
                      </td>
                      <td className="p-3 border-b border-gray-200">{data.sleepHours} hrs</td>
                      <td className="p-3 border-b border-gray-200">{data.workouts} mins</td>
                      <td className="p-3 border-b border-gray-200">
                        {data.caloriesBurned} kcal
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        <button
                          onClick={() => confirmDelete(data._id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full animate-slide-in-up">
              <h2 className="text-lg font-semibold mb-4 text-red-600">❗ Confirm Delete</h2>
              <p className="text-gray-600">
                Are you sure you want to delete this health data entry?
              </p>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
        .animate-fade-in { animation: fadeInUp 0.5s ease-out; }
        .animate-slide-in-up { animation: fadeInUp 0.5s ease-out; }
      `}</style>
    </div>
  );
}
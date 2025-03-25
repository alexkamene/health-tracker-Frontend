"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HealthTracker() {
  const [healthData, setHealthData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    weight: "", height: "", steps: "", sleepHours: "",
    workouts: "", heartRate: "", mentalHealthScore: "", caloriesBurned: "", activityType: ""
  });
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";

    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/healthdata", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHealthData(response.data);
    } catch (error) {
      console.error("❌ Error fetching health data:", error);
    }
  };

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post("https://heath-tracker-backend.onrender.com/healthdata", newEntry, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewEntry({ weight: "", height: "", steps: "", sleepHours: "", workouts: "", heartRate: "", mentalHealthScore: "", caloriesBurned: "", activityType: "" });
      fetchHealthData();
    } catch (error) {
      console.error("❌ Error logging health data:", error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://heath-tracker-backend.onrender.com/api/healthdata/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHealthData(healthData.filter((data) => data._id !== deleteId)); // Remove from UI
      setShowDeleteModal(false);
    } catch (error) {
      console.error("❌ Error deleting health data:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">📊 Health Tracker</h1>

      {/* ✅ Health Data Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-2">Log Your Health Data</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="weight" value={newEntry.weight} onChange={handleChange} placeholder="Weight (kg)" className="p-2 border rounded" required />
          <input type="number" name="height" value={newEntry.height} onChange={handleChange} placeholder="Height (cm)" className="p-2 border rounded" />
          <input type="number" name="steps" value={newEntry.steps} onChange={handleChange} placeholder="Steps" className="p-2 border rounded" />
          <input type="number" name="sleepHours" value={newEntry.sleepHours} onChange={handleChange} placeholder="Sleep Hours" className="p-2 border rounded" />
          <input type="number" name="workouts" value={newEntry.workouts} onChange={handleChange} placeholder="Workouts (mins)" className="p-2 border rounded" />
          <input type="number" name="heartRate" value={newEntry.heartRate} onChange={handleChange} placeholder="Heart Rate (BPM)" className="p-2 border rounded" />
          <input type="number" name="mentalHealthScore" value={newEntry.mentalHealthScore} onChange={handleChange} placeholder="Mental Health (1-10)" className="p-2 border rounded" />
          <input type="number" name="caloriesBurned" value={newEntry.caloriesBurned} onChange={handleChange} placeholder="Calories Burned" className="p-2 border rounded" />
          <select name="activityType" value={newEntry.activityType} onChange={handleChange} className="p-2 border rounded">
            <option value="">Select Activity</option>
            <option value="Walking">Walking</option>
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"> Add Data</button>
      </form>

      {/* ✅ Display Logged Health Data */}
      <div className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-lg font-semibold mb-4">📅 Logged Health Data</h3>

  {healthData.length === 0 ? (
    <p className="text-gray-500 text-center">No data recorded yet.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 border border-gray-300"> Date</th>
            <th className="p-3 border border-gray-300"> Steps</th>
            <th className="p-3 border border-gray-300"> Sleep (hrs)</th>
            <th className="p-3 border border-gray-300"> Workouts (mins)</th>
            <th className="p-3 border border-gray-300">Calories Burned</th>
            <th className="p-3 border border-gray-300"> Actions</th>
          </tr>
        </thead>
        <tbody>
          {healthData.map((data, index) => (
            <tr key={data._id} className="text-center bg-gray-100 hover:bg-gray-200 transition">
              <td className="p-3 border border-gray-300">{new Date(data.loggedAt).toLocaleDateString()}</td>
              <td className="p-3 border border-gray-300">{data.steps.toLocaleString()}</td>
              <td className="p-3 border border-gray-300">{data.sleepHours} hrs</td>
              <td className="p-3 border border-gray-300">{data.workouts} mins</td>
              <td className="p-3 border border-gray-300">{data.caloriesBurned} kcal</td>
              <td className="p-3 border border-gray-300">
                <button
                  onClick={() => confirmDelete(data._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">❗ Confirm Delete</h2>
            <p>Are you sure you want to delete this health data entry?</p>
            <div className="mt-4 flex justify-between">
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Yes, Delete</button>
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

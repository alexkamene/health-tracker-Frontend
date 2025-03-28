"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiLock, FiPenTool, FiUser, FiLogOut } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    medicalConditions: "",
    profilePic: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) window.location.href = "/login";
      try {
        const response = await axios.get("https://heath-tracker-backend.onrender.com/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data;
        setProfile({
          username: userData.username || "John Doe",
          email: userData.email || "john.doe@example.com",
          age: userData.age || "30",
          gender: userData.gender || "Male",
          height: userData.height || "175",
          weight: userData.weight || "70",
          medicalConditions: userData.medicalConditions || "None",
          profilePic: userData.profilePic || "https://via.placeholder.com/150",
        });
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        toast.error("Failed to load profile.", { position: "top-right" });
      }
    };

    const fetchJournalEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://heath-tracker-backend.onrender.com/api/journal", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJournalEntries(response.data);
      } catch (error) {
        console.error("❌ Error fetching journal entries:", error);
        toast.error("Failed to load journal entries.", { position: "top-right" });
      }
    };

    fetchProfile();
    fetchJournalEntries();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle Profile Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("https://heath-tracker-backend.onrender.com/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Profile updated successfully!");
      toast.success("Profile updated!", { position: "top-right" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setMessage("⚠️ Failed to update profile.");
      toast.error("Failed to update profile.", { position: "top-right" });
    }
  };

  // Handle Password Change
  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://heath-tracker-backend.onrender.com/changepassword",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Password updated successfully!");
      toast.success("Password updated!", { position: "top-right" });
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setMessage(error.response?.data?.error || "⚠️ Failed to update password.");
      toast.error("Failed to update password.", { position: "top-right" });
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    
    window.location.href = "/login";
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
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 animate-fade-in-down">
          <span className="text-green-600">Your Profile</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
            <div className="flex flex-col items-center">
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-green-500 shadow-md mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-900">{profile.username}</h2>
              <p className="text-gray-500">Health Enthusiast</p>
            </div>
            <div className="mt-6 space-y-3 text-gray-700">
              <p><span className="font-semibold text-indigo-600">Email:</span> {profile.email}</p>
              <p><span className="font-semibold text-indigo-600">Age:</span> {profile.age}</p>
              <p><span className="font-semibold text-indigo-600">Gender:</span> {profile.gender}</p>
              <p><span className="font-semibold text-indigo-600">Height:</span> {profile.height} cm</p>
              <p><span className="font-semibold text-indigo-600">Weight:</span> {profile.weight} kg</p>
              <p><span className="font-semibold text-indigo-600">Medical Conditions:</span> {profile.medicalConditions}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
            >
              <FiPenTool /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-300 hover:scale-105"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          {/* Calendar & Achievements */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
              <h3 className="text-xl font-semibold mb-4 text-green-600">📅 Activity Calendar</h3>
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

            {/* Achievements */}
            <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-left">
              <h3 className="text-xl font-semibold mb-4 text-purple-600">🏆 Achievements</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span> 10 Days Streak
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span> 50,000 Steps Milestone
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span> Consistent Tracker
                </li>
              </ul>
            </div>
          </div>

          {/* Journal & Password */}
          <div className="space-y-6">
            {/* Journal Preview */}
            <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right max-h-64 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">📝 Recent Journal Entries</h3>
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
              <Link href="/pages/dashboard/Journal" className="text-green-600 hover:underline text-sm block text-center">
                View All Entries
              </Link>
            </div>

            {/* Password Change */}
            <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-right">
              <h3 className="text-xl font-semibold mb-4 text-yellow-600 flex items-center gap-2">
                <FiLock /> Change Password
              </h3>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Old Password"
                className="p-3 border border-gray-300 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="p-3 border border-gray-300 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
              <button
                onClick={handlePasswordChange}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 hover:scale-105"
              >
                Update Password
              </button>
              <Link href="/ForgotPassword" className="text-red-500 text-sm mt-2 block text-center hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full animate-slide-in-up">
              <h2 className="text-2xl font-bold mb-6 text-indigo-600 flex items-center gap-2">
                <FiUser /> Edit Profile
              </h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                {[
                  { name: "username", placeholder: "Username", type: "text" },
                  { name: "email", placeholder: "Email", type: "email" },
                  { name: "age", placeholder: "Age", type: "number" },
                ].map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    name={field.name}
                    value={profile[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                ))}
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {[
                  { name: "height", placeholder: "Height (cm)", type: "number" },
                  { name: "weight", placeholder: "Weight (kg)", type: "number" },
                ].map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    name={field.name}
                    value={profile[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                ))}
                <textarea
                  name="medicalConditions"
                  value={profile.medicalConditions}
                  onChange={handleChange}
                  placeholder="Medical Conditions"
                  className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  rows="3"
                />
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300"
                  >
                    💾 Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
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
      `}</style>
    </div>
  );
};

export default Profile;
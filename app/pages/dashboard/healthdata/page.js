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
        const response = await axios.get("http://localhost:3000/user/profile", {
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
        const response = await axios.get("http://localhost:3000/api/journal", {
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
      await axios.put("http://localhost:3000/profile", profile, {
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
        "http://localhost:3000/changepassword",
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 relative overflow-hidden">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="w-72 h-72 bg-green-200 rounded-full absolute top-0 left-0 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-blue-200 rounded-full absolute bottom-10 right-10 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-green-800 animate-fade-in-down">
          <span className="text-blue-600">Your Health Profile</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-xl shadow-xl border border-green-100 animate-slide-in-up">
            <div className="flex flex-col items-center">
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md mb-4 transform hover:scale-105 transition-all duration-300"
              />
              <h2 className="text-2xl font-semibold text-blue-700">{profile.username}</h2>
              <p className="text-green-600 font-medium">Health Enthusiast</p>
            </div>
            <div className="mt-6 space-y-4 text-gray-700">
              <p>
                <span className="font-semibold text-purple-600">Email:</span> {profile.email}
              </p>
              <p>
                <span className="font-semibold text-purple-600">Age:</span> {profile.age}
              </p>
              <p>
                <span className="font-semibold text-purple-600">Gender:</span> {profile.gender}
              </p>
              <p>
                <span className="font-semibold text-purple-600">Height:</span> {profile.height} cm
              </p>
              <p>
                <span className="font-semibold text-purple-600">Weight:</span> {profile.weight} kg
              </p>
              <p>
                <span className="font-semibold text-purple-600">Medical Conditions:</span>{" "}
                {profile.medicalConditions}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md hover:from-blue-600 hover:to-teal-600 transition-all duration-300 hover:scale-105"
            >
              <FiPenTool /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:scale-105"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          {/* Calendar & Achievements */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-white p-6 rounded-xl shadow-xl border border-teal-100 animate-slide-in-left">
              <h3 className="text-xl font-semibold mb-4 text-green-600">📅 Activity Calendar</h3>
              <Calendar
                onChange={setCalendarDate}
                value={calendarDate}
                className="border-none w-full text-gray-700 rounded-lg shadow-sm"
                tileClassName={({ date }) => {
                  const entryDates = journalEntries.map((e) => new Date(e.date).toDateString());
                  return entryDates.includes(date.toDateString())
                    ? "bg-green-100 rounded-full text-green-700 font-medium"
                    : null;
                }}
              />
            </div>

            {/* Achievements */}
            <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-100 animate-slide-in-left">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">🏆 Achievements</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-center gap-3">
                  <span className="text-yellow-500 text-xl">⭐</span> 10 Days Streak
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-500 text-xl">⭐</span> 50,000 Steps Milestone
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-500 text-xl">⭐</span> Consistent Tracker
                </li>
              </ul>
            </div>
          </div>

          {/* Journal & Password */}
          <div className="space-y-6">
            {/* Journal Preview */}
            <div className="bg-white p-6 rounded-xl shadow-xl border border-blue-100 animate-slide-in-right max-h-64 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-purple-600">📝 Recent Journal Entries</h3>
              {journalEntries.length === 0 ? (
                <p className="text-gray-500 text-center">No entries yet.</p>
              ) : (
                journalEntries.slice(0, 3).map((entry) => (
                  <div key={entry._id} className="mb-4 bg-blue-50 p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between text-sm text-blue-600">
                      <p>{new Date(entry.date).toLocaleDateString()}</p>
                      <p>{new Date(entry.date).toLocaleTimeString()}</p>
                    </div>
                    <p className="text-blue-700">{entry.entry.substring(0, 100)}...</p>
                  </div>
                ))
              )}
              <Link
                href="/pages/dashboard/Journal"
                className="text-teal-600 hover:text-teal-700 text-sm block text-center font-medium transition-all duration-300"
              >
                View All Entries
              </Link>
            </div>

            {/* Password Change */}
            <div className="bg-white p-6 rounded-xl shadow-xl border border-green-100 animate-slide-in-right">
              <h3 className="text-xl font-semibold mb-4 text-blue-600 flex items-center gap-2">
                <FiLock /> Change Password
              </h3>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Old Password"
                className="w-full p-3 bg-blue-50 border border-blue-300 rounded-lg text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full p-3 mt-4 bg-blue-50 border border-blue-300 rounded-lg text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              />
              <button
                onClick={handlePasswordChange}
                className="w-full mt-6 bg-gradient-to-r from-teal-500 to-purple-500 text-white py-3 rounded-lg font-semibold shadow-md hover:from-teal-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
              >
                Update Password
              </button>
              <Link
                href="/ForgotPassword"
                className="text-red-500 text-sm mt-3 block text-center hover:text-red-600 transition-all duration-300"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full border border-teal-100 animate-slide-in-up">
              <h2 className="text-2xl font-semibold mb-6 text-green-600 flex items-center gap-2">
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
                    className="w-full p-3 bg-green-50 border border-green-300 rounded-lg text-green-800 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                ))}
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full p-3 bg-green-50 border border-green-300 rounded-lg text-green-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
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
                    className="w-full p-3 bg-green-50 border border-green-300 rounded-lg text-green-800 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                ))}
                <textarea
                  name="medicalConditions"
                  value={profile.medicalConditions}
                  onChange={handleChange}
                  placeholder="Medical Conditions (e.g., diabetes, hypertension)"
                  className="w-full p-3 bg-green-50 border border-green-300 rounded-lg text-green-800 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                  rows="3"
                />
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105"
                  >
                    💾 Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold shadow-md hover:bg-gray-300 transition-all duration-300 hover:scale-105"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        /* Custom Select */
        select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2334D399'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.5em;
        }

        /* Animations */
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
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
        .animate-slide-in-up { animation: slideInUp 0.8s ease-out; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out; }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default Profile;
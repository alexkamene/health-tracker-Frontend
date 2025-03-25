"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FiLock, FiPenTool } from "react-icons/fi";

const Profile = () => {

  // setting the profile
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
  const [isTaskNotificationOpen, setIsTaskNotificationOpen] = useState(true); // For task notification pop-up
  const [JournalEntries, setJournalEntries] = useState([])
  // Fetch Profile Data
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://heath-tracker-backend.onrender.com/api/journal", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJournalEntries(response.data);
      } catch (error) {
        console.error("❌ Error fetching journal entries:", error);
      }
    };
    fetchEntries();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
      }
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
      }
    };
    fetchProfile();
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
      setIsModalOpen(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setMessage("⚠️ Failed to update profile.");
    }
  };

  // Handle Password Change
  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://heath-tracker-backend.onrender.com/changepassword",
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("✅ Password updated successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.error || "⚠️ Failed to update password."
      );
    }
  };

  // Sample calendar data (static for now)
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const highlightedDays = [8, 10, 17]; // Days highlighted in the image

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            {profile.profilePic ? (
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-blue-600"
              />
            ) : (
              <img
                src="https://via.placeholder.com/150"
                alt="Default Profile"
                className="w-24 h-24 rounded-full border-2 border-blue-600"
              />
            )}
            <h2 className="text-xl font-semibold mt-2">{profile.username}</h2>
            <p className="text-gray-500">Agile Health enthusiasi</p>
          </div>

          <div className="mt-4 space-y-2">
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Age:</strong> {profile.age}
            </p>
            <p>
              <strong>Gender:</strong> {profile.gender}
            </p>
            <p>
              <strong>Height:</strong> {profile.height} cm
            </p>
            <p>
              <strong>Weight:</strong> {profile.weight} kg
            </p>
            <p>
              <strong>Medical Conditions:</strong> {profile.medicalConditions}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-blue-600 text-white py-2 rounded-lg w-full hover:bg-blue-700 transition"
          >

            Edit Profile

          </button>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-blue-600">
              <div className="flex flex-row gap-1">
                <div>
                  <FiLock />
                </div>
                <div>
                  Change password
                </div>
              </div>
            </h3>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Old Password"
              className="p-2 border rounded-lg w-full mt-2"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="p-2 border rounded-lg w-full mt-2"
            />
            <button
              onClick={handlePasswordChange}
              className="bg-red-500 text-white py-2 rounded-lg w-full mt-2 hover:bg-red-600 transition"
            >
              Update Password
            </button>
            <Link
              href="/ForgotPassword"
              className="text-red-500 text-sm mt-2 block text-center hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Right Column: Calendar and Team Management */}
        <div className="space-y-6">
          {/* Calendar Widget */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">



            </h3>
            <div className="grid grid-cols-7 gap-2 text-center">
              <div className="font-semibold">S</div>
              <div className="font-semibold">M</div>
              <div className="font-semibold">T</div>
              <div className="font-semibold">W</div>
              <div className="font-semibold">T</div>
              <div className="font-semibold">F</div>
              <div className="font-semibold">S</div>
              {/* Empty spaces for days before the 1st */}
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`empty-${i}`}></div>
              ))}
              {calendarDays.map((day) => (
                <div
                  key={day}
                  className={`p-2 rounded-full ${highlightedDays.includes(day)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700"
                    }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Team Management Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Manage Members
            </h3>
            <input
              type="text"
              placeholder="Search for a person in your Team by name or email..."
              className="p-2 border rounded-lg w-full mb-4"
            />
            <div className="flex items-center space-x-4 mb-4">
              <img
                src="https://via.placeholder.com/40"
                alt="Team Member"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-gray-500 text-sm">Regular</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white py-2 rounded-lg w-full hover:bg-blue-700 transition">
              Invite
            </button>
            <p className="text-gray-500 text-sm mt-2 text-center">
              <Link href="#" className="text-blue-600 hover:underline">
                Copy link to this project
              </Link>
            </p>
          </div>
        </div>

        {/* Task and Notification Section */}
        <div className="space-y-6">
          {/* Notification Bell */}
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-2">
            <span className="text-blue-600">🔔</span>
            <p className="text-blue-600 font-semibold">
              You have 2 new notifications! Check it out! Don’t miss important
              information!
            </p>
          </div>


          {/* journal */}
          <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto">

            {
              JournalEntries.length === 0 ? (
                <p className="text-center text-gray-500">No entries yet.</p>
              ) : (

                JournalEntries.slice(0,2).map((entry) => (
                  <div key={entry._id} >
                    <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-600 text-sm">latest Entries</p>
                    <p className="text-blue-600 text-sm">{new Date(entry.date).toLocaleString()}</p> 
                    </div>
                   
                    <div>
                    <p>{entry.entry}</p>
                    </div>
                  </div>
                  
                ))

              )
            }

          </div>
        </div>
      </div>

      {/* Task Notification Pop-up */}
      {isTaskNotificationOpen && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
          <span className="text-green-500">✅</span>
          <div>
            <p className="font-semibold">New task successfully saved as draft!</p>
            <p className="text-gray-500 text-sm">
              You can go back and execute it anytime you want.
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg"
              onClick={() => setIsTaskNotificationOpen(false)}
            >
              Edit
            </button>
            <button
              className="bg-blue-600 text-white py-1 px-3 rounded-lg"
              onClick={() => setIsTaskNotificationOpen(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Modal for Updating Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              ✏️ Edit Profile
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                placeholder="Username"
                className="p-2 border rounded-lg w-full"
              />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
                className="p-2 border rounded-lg w-full"
              />
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                placeholder="Age"
                className="p-2 border rounded-lg w-full"
              />
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="p-2 border rounded-lg w-full"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="number"
                name="height"
                value={profile.height}
                onChange={handleChange}
                placeholder="Height (cm)"
                className="p-2 border rounded-lg w-full"
              />
              <input
                type="number"
                name="weight"
                value={profile.weight}
                onChange={handleChange}
                placeholder="Weight (kg)"
                className="p-2 border rounded-lg w-full"
              />
              <textarea
                name="medicalConditions"
                value={profile.medicalConditions}
                onChange={handleChange}
                placeholder="Medical Conditions"
                className="p-2 border rounded-lg w-full"
              ></textarea>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  💾 Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { FiBell, FiSettings, FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      fetchNotifications(token);
    }
  }, []);

  // ✅ Fetch Notifications from Backend
  const fetchNotifications = async (token) => {
    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.read).length); // Count unread notifications
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    }
  };
  const handlelogout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.reload();


  }

  // ✅ Mark Notifications as Read
  const markNotificationsAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post("https://heath-tracker-backend.onrender.com/api/notifications/mark-as-read", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications(token); // Refresh notifications
      setUnreadCount(0);
    } catch (error) {
      console.error("❌ Error marking notifications as read:", error);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSettings = () => setShowSettings(!showSettings);
  const toggleProfile = () => setShowProfile(!showProfile);

  return (
    <div className="top-0 z-50 shadow-md w-full sticky bg-white">
      <nav className="bg-white text-gray-500 shadow-md px-6">
        <div className="container mx-auto flex justify-between h-16 items-center">
          {/* Logo */}
          <h1 className="text-2xl font-mono text-black font-extrabold">
            <Link href="/">MyHealth</Link>
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 font-medium">
            <Link href="/" className="hover:text-blue-500">Home</Link>
            <Link href="#" className="hover:text-blue-500">About</Link>
            {isLoggedIn && (
              <>
                <Link href="/pages/dashboard" className="hover:text-blue-500">Dashboard</Link>
                <Link href="/pages/dashboard/Journal" className="hover:text-blue-500">Journals</Link>
                <Link href="/pages/dashboard/healthdata" className="hover:text-blue-500">healthdata</Link>
              </>
            )}
          </div>

          {/* User Profile & Actions (Only if Logged In) */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center space-x-4">
              {/* 🔔 Notifications */}
              <div className="relative" onMouseEnter={() => setShowNotifications(true)} onMouseLeave={() => setShowNotifications(false)}>
                <div className="relative cursor-pointer">
                  <FiBell className="w-6 h-6 text-gray-600 hover:text-blue-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
                    <h3 className="text-sm font-semibold mb-2">🔔 Notifications</h3>
                    {notifications.length === 0 ? (
                      <p className="text-gray-500">No new notifications.</p>
                    ) : (
                      <ul className="space-y-2">
                        {notifications.slice(0, 5).map((notification, index) => (
                          <li key={index} className="p-2 border-b text-sm">{notification.message}</li>
                        ))}
                      </ul>
                    )}
                    <button onClick={markNotificationsAsRead} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded w-full">
                      ✔️ Mark All as Read
                    </button>
                  </div>
                )}
              </div>

              {/* ⚙️ Settings */}
              <div className="relative">
                <FiSettings className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" onClick={toggleSettings} />
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4 z-50">
                    <Link href="/pages/dashbaord/settings" className="block p-2 hover:bg-gray-100">🔧 General Settings</Link>
                    <Link href="#" className="block p-2 hover:bg-gray-100">🔒 Privacy</Link>
                    <button onClick={toggleSettings} className="w-full text-left p-2 hover:bg-gray-100">❌ Close</button>
                  </div>
                )}
              </div>

              {/* 👤 Profile */}
              <div className="relative">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleProfile}>
                  <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
                  <span className="text-gray-700 font-medium">{username}</span>
                </div>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4 z-50">
                    <Link href="/pages/dashboard/Profile" className="block p-2 hover:bg-gray-100">👤 View Profile</Link>
                    <button onClick={handlelogout} className="block p-2 hover:bg-gray-100 text-red-500  items-center">
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                    <button onClick={toggleProfile} className="w-full text-left p-2 hover:bg-gray-100">Close</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 🍔 Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-xl focus:outline-none">
              {menuOpen ? <FiX className="w-8 h-8" /> : <FiMenu className="w-8 h-8" />}
            </button>
          </div>
        </div>

        {/* 📱 Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t absolute top-16 left-0 w-full flex flex-col items-center p-4 space-y-4 shadow-md">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/About" onClick={() => setMenuOpen(false)}>About</Link>
            {isLoggedIn && (
              <>
                <Link href="/pages/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/Projects" onClick={() => setMenuOpen(false)}>Health Metrics</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

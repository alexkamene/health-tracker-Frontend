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
      setUsername(storedUsername || "User");
      fetchNotifications(token);
    }
  }, []);

  const fetchNotifications = async (token) => {
    try {
      const response = await axios.get("http://localhost:3000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    }
  };

  const markNotificationsAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:3000/api/notifications/mark-as-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications(token);
      setUnreadCount(0);
    } catch (error) {
      console.error("❌ Error marking notifications as read:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.reload();
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleSettings = () => setShowSettings(!showSettings);
  const toggleProfile = () => setShowProfile(!showProfile);

  return (
    <div className="top-0 z-50 sticky w-full bg-gradient-to-br from-indigo-50 to-green-50  text-black ">
      <nav className="px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold tracking-tight">
            <Link href="/">HealthHub</Link>
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center font-medium">
            <Link href="/" className="hover:text-indigo-200 transition-colors">Home</Link>
            <Link href="/About" className="hover:text-green-400 transition-colors">About</Link>
            {isLoggedIn && (
              <>
                <Link href="/pages/dashboard" className="hover:text-indigo-200 transition-colors">
                  Dashboard
                </Link>
                <Link href="/pages/dashboard/Journal" className="hover:text-indigo-200 transition-colors">
                  Journals
                </Link>
                <Link href="/pages/dashboard/healthdata" className="hover:text-indigo-200 transition-colors">
                  Health Data
                </Link>
                <Link href="/pages/dashboard/adddata" className="hover:text-indigo-200 transition-colors">
                  Log Data
                </Link>
              </>
            )}
          </div>

          {/* User Actions (Desktop & Mobile) */}
          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              {/* 🔔 Notifications */}
              <div className="relative">
                <button onClick={toggleNotifications} className="relative focus:outline-none">
                  <FiBell className="w-6 h-6 hover:text-indigo-200 transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Full-Screen Notification Panel */}
                {showNotifications && (
                  <div className="fixed inset-0 bg-gray-900 bg-opacity-95 text-white z-50 p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">🔔 Notifications</h3>
                      <button onClick={toggleNotifications} className="text-2xl">
                        <FiX />
                      </button>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-gray-400 text-center ">No new notifications.</p>
                    ) : (
                      <ul className="space-y-4 ">
                        {notifications.map((notification, index) => (
                          <li
                            key={index}
                            className={`p-4 rounded-lg ${
                              notification.read ? "bg-gray-800" : "bg-green-400"
                            }`}
                          >
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1 ">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={markNotificationsAsRead}
                      className="mt-6 w-full py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                    >
                      ✔️ Mark All as Read
                    </button>
                  </div>
                )}
              </div>

              {/* ⚙️ Settings */}
              <div className="relative">
                <button onClick={toggleSettings} className="focus:outline-none">
                  <FiSettings className="w-6 h-6 hover:text-indigo-200 transition-colors" />
                </button>
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 shadow-lg rounded-lg p-4 z-50">
                    <Link href="/pages/dashboard/settings" className="block p-2 hover:bg-indigo-50">
                      General Settings
                    </Link>
                    <Link href="#" className="block p-2 hover:bg-indigo-50">
                      Privacy
                    </Link>
                    <button onClick={toggleSettings} className="w-full text-left p-2 hover:bg-indigo-50">
                       Close
                    </button>
                  </div>
                )}
              </div>

              {/* 👤 Profile (Desktop Only) */}
              <div className="hidden md:block relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={toggleProfile}
                >
                  <img
                    src="https://via.placeholder.com/40"
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-indigo-200"
                  />
                  <span className="font-medium">{username}</span>
                </div>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 shadow-lg rounded-lg p-4 z-50">
                    <Link href="/pages/dashboard/Profile" className="block p-2 hover:bg-indigo-50">
                      👤 View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left p-2 hover:bg-indigo-50 text-red-500"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                    <button onClick={toggleProfile} className="w-full text-left p-2 hover:bg-indigo-50">
                      Close
                    </button>
                  </div>
                )}
              </div>

              {/* 🍔 Hamburger (Mobile Only) */}
              <div className="md:hidden">
                <button onClick={toggleMenu} className="focus:outline-none">
                  {menuOpen ? <FiX className="w-8 h-8" /> : <FiMenu className="w-8 h-8" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 📱 Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-32 w-full bg-white text-black shadow-md p-6 space-y-4">
            <Link href="/" onClick={toggleMenu} className="block py-2 hover:bg-indigo-600 rounded">
              Home
            </Link>
            <Link href="/About" onClick={toggleMenu} className="block py-2 hover:bg-indigo-600 rounded">
              About
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href="/pages/dashboard"
                  onClick={toggleMenu}
                  className="block py-2 hover:bg-indigo-600 rounded"
                >
                  Dashboard
                </Link>
                <Link
                  href="/pages/dashboard/Journal"
                  onClick={toggleMenu}
                  className="block py-2 hover:bg-indigo-600 rounded"
                >
                  Journals
                </Link>
                <Link
                  href="/pages/dashboard/healthdata"
                  onClick={toggleMenu}
                  className="block py-2 hover:bg-indigo-600 rounded"
                >
                  Health Data
                </Link>
                <Link
                  href="/pages/dashboard/Profile"
                  onClick={toggleMenu}
                  className="block py-2 hover:bg-indigo-600 rounded"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center w-full py-2 hover:bg-indigo-600 rounded text-red-300"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
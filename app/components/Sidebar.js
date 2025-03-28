"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  FiActivity,
  FiBarChart,
  FiBarChart2,
  FiCalendar,
  FiHome,
  FiLogOut,
  FiSettings,
  FiWind,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function SideBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleLeaderboard = () => setIsLeaderboardOpen(!isLeaderboardOpen);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col h-screen w-64 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white shadow-xl p-5">
        <h2 className="text-2xl font-bold mb-6 tracking-wide">HealthHub</h2>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer">
              <FiHome className="w-5 h-5" />
              <Link href="/dashboard">
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer">
              <FiBarChart className="w-5 h-5" />
              <Link href="/pages/dashboard/Analytics">
                <span>Analytics</span>
              </Link>
            </li>
            <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer">
              <FiWind className="w-5 h-5" />
              <Link href="/pages/dashboard/challenges">
                <span>Challenges</span>
              </Link>
            </li>
            {/* Leaderboard with Dropdown */}
            <li className="relative">
              <div
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer"
                onClick={toggleLeaderboard}
              >
                <FiBarChart2 className="w-5 h-5" />
                <span>Leaderboard</span>
              </div>
              {isLeaderboardOpen && (
                <ul className="absolute left-0 mt-1 w-48 bg-indigo-800 rounded-lg shadow-lg z-10">
                  <li className="p-2 hover:bg-indigo-700 rounded-t-lg">
                    <Link href="/pages/dashboard/Leaderboard">rank</Link>
                  </li>
                  <li className="p-2 hover:bg-indigo-700">
                    <Link href="/pages/dashboard/Leaderboard/friends">Friends</Link>
                  </li>
                  <li className="p-2 hover:bg-indigo-700 rounded-b-lg">
                    <Link href="/pages/dashboard/Leaderboard/personal">Personal</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer">
              <FiActivity className="w-5 h-5" />
              <Link href="/pages/dashboard/gamification">
                <span>Gamification</span>
              </Link>
            </li>
            <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer">
              <FiCalendar className="w-5 h-5" />
              <Link href="/pages/dashboard/Calendar">
                <span>Calendar</span>
              </Link>
            </li>
            <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer">
              <FiSettings className="w-5 h-5" />
              <Link href="/pages/dashboard/Settings">
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <button className="mt-auto flex items-center space-x-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors w-full">
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden">
        {/* Top Bar with Hamburger */}
        <div >
        
          <button className="fixed text-xl top-28 left-0  right-0 z-50" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="fixed top-16 left-0 right-32 bg-white text-black shadow-lg z-40">
            <nav className="p-4">
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 p-2 hover:bg-indigo-700 rounded-lg">
                  <FiHome className="w-5 h-5" />
                  <Link href="/dashboard" onClick={toggleMobileMenu}>
                    Dashboard
                  </Link>
                </li>
                <li className="flex items-center space-x-3 p-2 hover:bg-indigo-700 rounded-lg">
                  <FiBarChart className="w-5 h-5" />
                  <Link href="/pages/dashboard/Analytics" onClick={toggleMobileMenu}>
                    Analytics
                  </Link>
                </li>
                <li className="flex items-center space-x-3 p-2 hover:bg-indigo-700 rounded-lg">
                  <FiWind className="w-5 h-5" />
                  <Link href="/pages/dashboard/challenges" onClick={toggleMobileMenu}>
                    Challenges
                  </Link>
                </li>
                {/* Leaderboard Dropdown in Mobile */}
                <li className="relative">
                  <div
                    className="flex items-center space-x-3 p-2 hover:bg-indigo-700 rounded-lg cursor-pointer"
                    onClick={toggleLeaderboard}
                  >
                    <FiBarChart2 className="w-5 h-5" />
                    <span>Leaderboard</span>
                  </div>
                  {isLeaderboardOpen && (
                    <ul className="pl-6 space-y-2 mt-1">
                      <li className="p-2 hover:bg-indigo-600 rounded-lg">
                        <Link href="/pages/dashboard/Leaderboard" onClick={toggleMobileMenu}>
                          Rank
                        </Link>
                      </li>
                      <li className="p-2 hover:bg-indigo-600 rounded-lg">
                        <Link href="/pages/dashboard/Leaderboard/friends" onClick={toggleMobileMenu}>
                          Friends
                        </Link>
                      </li>
                      <li className="p-2 hover:bg-indigo-600 rounded-lg">
                        <Link href="/pages/dashboard/Leaderboard/personal" onClick={toggleMobileMenu}>
                          Personal
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li className="flex items-center space-x-3 p-2 hover:bg-indigo-700 rounded-lg">
                  <FiActivity className="w-5 h-5" />
                  <Link href="/pages/dashboard/gamification" onClick={toggleMobileMenu}>
                    Gamification
                  </Link>
                </li>
                <li className="flex items-center space-x-3 p-2 hover:bg-indigo-700 rounded-lg">
                  <FiCalendar className="w-5 h-5" />
                  <Link href="/pages/dashboard/Calendar" onClick={toggleMobileMenu}>
                    Calendar
                  </Link>
                </li>
                <li className="flex items-center space-x-3 p-2 hover:bg-indigo-700 rounded-lg">
                  <FiSettings className="w-5 h-5" />
                  <Link href="/pages/dashboard/Settings" onClick={toggleMobileMenu}>
                    Settings
                  </Link>
                </li>
                <li className="flex items-center space-x-3 p-2 bg-red-600 hover:bg-red-700 rounded-lg">
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Bottom Navbar for Mobile (Core Items) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md border-t p-2">
          <nav className="flex justify-around">
            <Link
              href="/pages/dashboard"
              className="flex flex-col items-center text-indigo-600 hover:text-indigo-800"
            >
              <FiHome className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Link>
            <Link
              href="/pages/dashboard/Analytics"
              className="flex flex-col items-center text-indigo-600 hover:text-indigo-800"
            >
              <FiBarChart className="w-6 h-6" />
              <span className="text-xs">Analytics</span>
            </Link>
            <Link
              href="/pages/dashboard/challenges"
              className="flex flex-col items-center text-indigo-600 hover:text-indigo-800"
            >
              <FiWind className="w-6 h-6" />
              <span className="text-xs">Challenges</span>
            </Link>
            <Link
              href="/pages/dashboard/Calendar"
              className="flex flex-col items-center text-indigo-600 hover:text-indigo-800"
            >
              <FiCalendar className="w-6 h-6" />
              <span className="text-xs">Calendar</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
'use client'
import Link from "next/link";
import React from "react";
import {
  FiActivity,
  FiBarChart,
  FiBarChart2,
  FiCalendar,
  FiHome,
  FiLogOut,
  FiSettings,
  FiWind,
} from "react-icons/fi";

export default function SideBar() {
  return (
    <>
      {/* Desktop Sidebar (Visible on medium & larger screens) */}
      <div className="hidden md:flex flex-col h-screen w-64 bg-white shadow-lg p-5">
        <h2 className="text-2xl font-bold text-blue-600 mb-5">Welcome</h2>
        <nav>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <FiHome className="w-5 h-5" />
              <Link href="/dashboard">
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <FiBarChart className="w-5 h-5" />
              <span>Analytics</span>
            </li>
            <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <FiWind className="w-5 h-5" />
              <Link href="/pages/dashboard/challenges"><span>Challenges</span></Link>
              
            </li>
            <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <FiBarChart2 className="w-5 h-5" />
              <Link href="/pages/dashboard/Leaderboard"> 
              <span>Leaderboard</span></Link>
             
            </li>
            <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <FiActivity className="w-5 h-5" />
              <Link href="/pages/dashboard/gamification"> 
              <span>Gamification</span></Link>
             
            </li>
            <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <FiCalendar className="w-5 h-5" />
              <Link href="/pages/dashboard/Calendar"> 
              <span>Calendar</span></Link>
            </li>
            <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <FiSettings className="w-5 h-5" />
              <Link href="/pages/dashboard/Settings"> 
              <span>Settings</span></Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <button className="mt-auto flex items-center space-x-3 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 w-full">
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Bottom Navbar for Mobile (Visible only on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0  right-0 z-50 w-full bg-white shadow-md border-t p-2">
        <nav className="flex justify-around">
          <Link href="/pages/dashboard" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
            <FiHome className="w-6 h-6" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/pages/dashboard/Analytics" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
            <FiBarChart className="w-6 h-6" />
            <span className="text-xs">Analytics</span>
          </Link>
          <Link href="/pages/dashboard/challenges" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
            <FiWind className="w-6 h-6" />
            <span className="text-xs">Challenges</span>
          </Link>
          <Link href="/pages/dashboard/Leaderboard" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
            <FiBarChart2 className="w-6 h-6" />
            <span className="text-xs">Leaderboard</span>
          </Link>
          <Link href="/pages/dashboard/settings" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
            <FiSettings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </Link>
        </nav>
      </div>
    </>
  );
}

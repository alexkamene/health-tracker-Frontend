"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

export default function HealthCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [healthEvents, setHealthEvents] = useState([]);

  useEffect(() => {
    fetchHealthEvents();
  }, [selectedDate]);

  // 📌 Fetch health-related events (workouts, sleep, steps)
  const fetchHealthEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("https://heath-tracker-backend.onrender.com/healthdata", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter events matching selected date
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const events = response.data.filter((event) => event.loggedAt.startsWith(formattedDate));

      setHealthEvents(events);
    } catch (error) {
      console.error("❌ Error fetching health events:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">📅 Health Calendar</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar Widget */}
        <div className="w-full md:w-1/2 bg-white p-4 shadow-md rounded-lg">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date, view }) => {
              // Highlight dates with logged health data
              const formattedDate = date.toISOString().split("T")[0];
              return healthEvents.some((event) => event.loggedAt.startsWith(formattedDate))
                ? "bg-green-300 text-white font-bold"
                : "";
            }}
          />
        </div>

        {/* Events & Health Data Section */}
        <div className="w-full md:w-1/2 bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2">📌 Daily Health Summary</h2>
          {healthEvents.length === 0 ? (
            <p className="text-gray-500">No health data logged for this day.</p>
          ) : (
            <ul className="space-y-3">
              {healthEvents.map((event) => (
                <li key={event._id} className="p-3 border-b flex justify-between items-center">
                  <div>
                    <p><strong>🏃 Steps:</strong> {event.steps}</p>
                    <p><strong>💤 Sleep:</strong> {event.sleepHours} hrs</p>
                    <p><strong>💪 Workouts:</strong> {event.workouts} mins</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

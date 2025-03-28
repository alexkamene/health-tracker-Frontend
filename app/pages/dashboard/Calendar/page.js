"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HealthCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [healthEvents, setHealthEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    date: "",
    reminderType: "Workout",
  });
  const [loadingHealthEvents, setLoadingHealthEvents] = useState(false);
  const [loadingReminders, setLoadingReminders] = useState(false);

  useEffect(() => {
    fetchHealthEvents();
    fetchReminders();
  }, [selectedDate]);

  useEffect(() => {
    reminders.forEach((reminder) => {
      if (!reminder.completed) {
        const timeUntilReminder = new Date(reminder.date) - new Date();
        if (timeUntilReminder > 0) {
          setTimeout(() => {
            toast.info(`⏰ Reminder: ${reminder.title} (${reminder.reminderType})`, {
              position: "top-right",
              autoClose: 5000,
            });
          }, timeUntilReminder);
        }
      }
    });
  }, [reminders]);

  const fetchReminders = async () => {
    setLoadingReminders(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/api/reminders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(response.data);
    } catch (error) {
      console.error("❌ Error fetching reminders:", error);
      toast.error("Failed to fetch reminders");
    } finally {
      setLoadingReminders(false);
    }
  };

  const fetchHealthEvents = async () => {
    setLoadingHealthEvents(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("https://heath-tracker-backend.onrender.com/healthdata", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedDate = selectedDate.toISOString().split("T")[0];
      const events = response.data.filter((event) =>
        event.loggedAt.startsWith(formattedDate)
      );
      setHealthEvents(events);
    } catch (error) {
      console.error("❌ Error fetching health events:", error);
      toast.error("Failed to fetch health events");
    } finally {
      setLoadingHealthEvents(false);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("https://heath-tracker-backend.onrender.com/reminder", newReminder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Reminder Added Successfully!");
      fetchReminders();
      setNewReminder({
        title: "",
        description: "",
        date: "",
        reminderType: "Workout",
      });
    } catch (error) {
      console.error("❌ Error adding reminder:", error);
      toast.error("Failed to add reminder");
    }
  };

  const handleCompleteReminder = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `https://heath-tracker-backend.onrender.com/reminder/${id}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Reminder marked as completed!");
      fetchReminders();
    } catch (error) {
      console.error("❌ Error completing reminder:", error);
      toast.error("Failed to complete reminder");
    }
  };

  const handleDeleteReminder = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://heath-tracker-backend.onrender.com/reminder/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Reminder deleted successfully!");
      fetchReminders();
    } catch (error) {
      console.error("❌ Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  const tileClassName = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    return reminders.some((r) => new Date(r.date).toISOString().split("T")[0] === formattedDate)
      ? "bg-indigo-500 text-white rounded-full"
      : "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      <h1 className="md:text-4xl text-lg font-bold text-center text-indigo-700 mb-8">
        📅 Health Calendar
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
            <h2 className="md:text-2xl  text-lg font-semibold text-indigo-600 mb-4">
              📊 Daily Health Summary
            </h2>
            {loadingHealthEvents ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : healthEvents.length === 0 ? (
              <p className="text-gray-500 italic">No health data logged for this day.</p>
            ) : (
              <ul className="space-y-4">
                {healthEvents.map((event) => (
                  <li
                    key={event._id}
                    className="p-4 bg-indigo-50 rounded-lg border border-indigo-200"
                  >
                    <p className="text-gray-800">
                      <strong className="text-indigo-600">🏃 Steps:</strong> {event.steps}
                    </p>
                    <p className="text-gray-800">
                      <strong className="text-indigo-600">💤 Sleep:</strong> {event.sleepHours} hrs
                    </p>
                    <p className="text-gray-800">
                      <strong className="text-indigo-600">💪 Workouts:</strong> {event.workouts} mins
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
            <h2 className="md:text-2xl text-lg font-semibold text-indigo-600 mb-4">
              ⏰ Reminders
            </h2>
            {loadingReminders ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : reminders.length === 0 ? (
              <p className="text-gray-500 italic">No reminders set.</p>
            ) : (
              <ul className="space-y-4">
                {reminders.map((reminder) => (
                  <li
                    key={reminder._id}
                    className={`p-4 rounded-lg border ${
                      reminder.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-purple-50 border-purple-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-800">
                          <strong className="text-purple-600">📅 Date:</strong>{" "}
                          {new Date(reminder.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-800">
                          <strong className="text-purple-600">📌 Title:</strong> {reminder.title}
                        </p>
                        <p className="text-gray-800">
                          <strong className="text-purple-600">📝 Description:</strong>{" "}
                          {reminder.description || "N/A"}
                        </p>
                        <p className="text-gray-800">
                          <strong className="text-purple-600">⏰ Type:</strong> {reminder.reminderType}
                        </p>
                        <p className="text-gray-800">
                          <strong className="text-purple-600">✅ Status:</strong>{" "}
                          {reminder.completed ? "Completed" : "Pending"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {!reminder.completed && (
                          <button
                            onClick={() => handleCompleteReminder(reminder._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReminder(reminder._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={tileClassName}
              className="border-none w-full"
            />
            <h3 className="mt-4 text-lg font-medium text-gray-700 text-center">
              Selected: <span className="text-indigo-600">{selectedDate.toDateString()}</span>
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
            <h2 className="md:text-2xl  text-lg font-semibold text-indigo-600 mb-4 text-center">
              Add New Reminder
            </h2>
            <form onSubmit={handleAddReminder} className="space-y-4">
              <input
                type="text"
                name="title"
                value={newReminder.title}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, title: e.target.value })
                }
                placeholder="Reminder Title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                name="description"
                value={newReminder.description}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, description: e.target.value })
                }
                placeholder="Description (optional)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="datetime-local"
                name="date"
                value={newReminder.date}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, date: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <select
                name="reminderType"
                value={newReminder.reminderType}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, reminderType: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Workout">Workout</option>
                <option value="Hydration">Hydration</option>
                <option value="Sleep">Sleep</option>
                <option value="Medication">Medication</option>
              </select>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Save Reminder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
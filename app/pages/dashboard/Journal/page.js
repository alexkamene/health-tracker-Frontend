"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiSave, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withCoalescedInvoke } from "next/dist/lib/coalesced-function";

const HealthJournal = () => {
  const [entry, setEntry] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch previous journal entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) window.location.href = "/login";
        const response = await axios.get("http://localhost:3000/api/journal", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJournalEntries(response.data);
      } catch (error) {
        console.error("❌ Error fetching journal entries:", error);
        toast.error("Failed to load journal entries.", { position: "top-right" });
      }
    };
    fetchEntries();
  }, []);

  // Handle journal submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "http://localhost:3000/api/journal",
        { entry },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Entry saved successfully!", { position: "top-right" });
      setJournalEntries([response.data.data, ...journalEntries]);
      setEntry("");
    } catch (error) {
      console.error("❌ Error saving journal entry:", error);
      toast.error("Failed to save entry.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a journal entry
  const handleDelete = async (entryId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/journal/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJournalEntries(journalEntries.filter((entry) => entry._id !== entryId));
      toast.success("Entry deleted!", { position: "top-right" });
    } catch (error) {
      console.error("❌ Error deleting journal entry:", error);
      toast.error("Failed to delete entry.", { position: "top-right" });
    }
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
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 animate-fade-in-down">
          <span className="text-green-600  md:text-xl text-lg">📝 Health Journal</span>
        </h1>

        {/* Journal Entry Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg max-w-lg mx-auto transform transition-all duration-300 hover:shadow-xl animate-fade-in-up"
        >
          <textarea
            className="w-full md:p-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 placeholder-gray-400 resize-none transition-all duration-300"
            rows="5"
            placeholder="How are you feeling today? Log your health thoughts..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="mt-4 w-full text-sm md:text-xl bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold  shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <FiSave /> Save Entry
              </>
            )}
          </button>
        </form>

        {/* Journal Entries */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6 animate-fade-in">
            <span className="text-indigo-600 md:text-xl text-lg">📜 Your Health Story</span>
          </h2>
          {journalEntries.length === 0 ? (
            <p className="text-center text-gray-500 animate-fade-in-up">
              Start your health journal today – no entries yet!
            </p>
          ) : (
            <ul className="mt-4 space-y-6">
              {journalEntries.map((entry, index) => (
                <li
                  key={entry._id}
                  className={`p-6 rounded-2xl shadow-md relative transform transition-all duration-300 hover:shadow-lg animate-slide-in-${
                    index % 2 === 0 ? "left" : "right"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${
                      index % 3 === 0
                        ? "#E0F7FA, #B2EBF2"
                        : index % 3 === 1
                        ? "#F3E8FF, #DDD6FE"
                        : "#ECFDF5, #D1FAE5"
                    })`,
                  }}
                >
                  <p className="text-gray-700">{entry.entry}</p>
                  <small className="block text-gray-500 mt-2">
                    {new Date(entry.date).toLocaleString()}
                  </small>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
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

export default HealthJournal;
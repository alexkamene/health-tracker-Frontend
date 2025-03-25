"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const HealthJournal = () => {
  const [entry, setEntry] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Fetch previous journal entries
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

  // ✅ Handle journal submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://heath-tracker-backend.onrender.com/api/journal",
        { entry },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      setJournalEntries([response.data.data, ...journalEntries]); // Add new entry to list
      setEntry(""); // Clear input
    } catch (error) {
      console.error("❌ Error saving journal entry:", error);
    }
  };

  // ✅ Handle deleting a journal entry
  const handleDelete = async (entryId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://heath-tracker-backend.onrender.com/api/journal/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJournalEntries(journalEntries.filter((entry) => entry._id !== entryId));
    } catch (error) {
      console.error("❌ Error deleting journal entry:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">📝 Health Journal</h1>
      {message && <p className="text-center text-green-500">{message}</p>}

      {/* ✅ Journal Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <textarea
          className="w-full p-2 border rounded"
          rows="4"
          placeholder="Write your thoughts on your health today..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 rounded w-full">
          ✍️ Save Entry
        </button>
      </form>

      {/* ✅ Display Journal Entries */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-center">📜 Your Journal Entries</h2>
        {journalEntries.length === 0 ? (
          <p className="text-center text-gray-500">No entries yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {journalEntries.map((entry) => (
              <li key={entry._id} className="bg-white p-4 rounded-lg shadow-md relative">
                <p>{entry.entry}</p>
                <small className="block text-gray-500 mt-2">
                  {new Date(entry.date).toLocaleString()}
                </small>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="absolute top-2 right-2 text-red-500"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HealthJournal;

"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const GamificationDashboard = () => {
  const [gamification, setGamification] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [friendId, setFriendId] = useState("");
  const [activity, setActivity] = useState({ type: "steps", value: "" });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchGamification(storedToken);
      fetchLeaderboard(storedToken);
    }
  }, []);

  // ✅ Fetch Gamification Data
  const fetchGamification = async (authToken) => {
    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/gamification", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setGamification(response.data);
      console.log(response.data)
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching gamification data:", error);
      setMessage("⚠️ Failed to fetch gamification data.");
      setLoading(false);
    }
  };

  // ✅ Fetch Leaderboard
  const fetchLeaderboard = async (authToken) => {
    try {
      const response = await axios.get("https://heath-tracker-backend.onrender.com/leaderboard?page=1", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error("❌ Error fetching leaderboard:", error);
    }
  };

  // ✅ Challenge a Friend
  const challengeFriend = async () => {
    try {
      const response = await axios.post(
        "https://heath-tracker-backend.onrender.com/challengefriend",
        { 
          opponentId: friendId, 
          challengeType: "steps", 
          target: 10000 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      fetchGamification(token); // Refresh gamification data
    } catch (error) {
      console.error("❌ Error sending challenge:", error);
      setMessage("⚠️ Failed to send challenge.");
    }
  };

  // ✅ Handle Activity Submission
  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://heath-tracker-backend.onrender.com/updategamification",
        {
          activityType: activity.type,
          value: Number(activity.value),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGamification(response.data.gamification);
      setMessage("✅ Activity recorded successfully!");
      setActivity({ ...activity, value: "" });
      fetchLeaderboard(token); // Refresh leaderboard
    } catch (error) {
      console.error("❌ Error recording activity:", error);
      setMessage("⚠️ Failed to record activity.");
    }
  };

  // ✅ Handle Challenge Response
  const handleChallengeResponse = async (accept) => {
    try {
      const response = await axios.post(
        "https://heath-tracker-backend.onrender.com/challengeresponse",
        { accept },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      fetchGamification(token); // Refresh after response
    } catch (error) {
      console.error("❌ Error responding to challenge:", error);
      setMessage("⚠️ Failed to respond to challenge.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">🏆 Gamification Dashboard</h1>

      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {message && (
        <p className={`text-center ${message.includes("⚠️") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      )}

      {gamification && (
        <div className="space-y-6">
          {/* Progress and Activity Section */}
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h3 className="text-lg font-semibold mb-4">🎯 Your Progress</h3>
            <div className="space-y-2">
              <p>Level: {gamification.level}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${gamification.progressToNextLevel}%` }}
                ></div>
              </div>
              <p>Points: {gamification.points}/{gamification.level * 1000}</p>
              <p>Total Steps: {gamification.totalSteps}</p>
              <p>Rank: #{gamification.rank}</p>
            </div>

            <h3 className="text-lg font-semibold mt-6">📈 Record Activity</h3>
            <form onSubmit={handleActivitySubmit} className="space-y-2">
              <select
                value={activity.type}
                onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="steps">Steps</option>
                <option value="sleep">Sleep (hours)</option>
                <option value="workout">Workout (minutes)</option>
              </select>
              <input
                type="number"
                value={activity.value}
                onChange={(e) => setActivity({ ...activity, value: e.target.value })}
                placeholder="Enter value"
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Record Activity
              </button>
            </form>
          </div>

          {/* Badges Section */}
          {/* <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h3 className="text-lg font-semibold mb-4">🎖 Your Badges</h3>
            {gamification.badges.length >0 ? (
              <ul className="flex flex-wrap gap-2">
                {gamification.badges.map((badge, index) => (
                  <li key={index} className="p-2 bg-yellow-300 rounded-lg text-sm">
                    {badge}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No badges earned yet.</p>
            )}
          </div> */}

          {/* Challenge Section */}
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h3 className="text-lg font-semibold mb-4">🔥 Challenges</h3>
            {gamification.activeChallenge ? (
              <div className="space-y-2">
                <p>Status: {gamification.activeChallenge.status}</p>
                <p>Type: {gamification.activeChallenge.type}</p>
                <p>Target: {gamification.activeChallenge.target}</p>
                <p>
                  Your Progress:{" "}
                  {gamification.activeChallenge.challengerId === gamification.userId
                    ? gamification.activeChallenge.challengerProgress
                    : gamification.activeChallenge.opponentProgress}
                </p>
                {gamification.activeChallenge.status === "pending" &&
                  gamification.activeChallenge.opponentId === gamification.userId && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleChallengeResponse(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleChallengeResponse(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter Friend's ID"
                  className="w-full p-2 border rounded"
                  value={friendId}
                  onChange={(e) => setFriendId(e.target.value)}
                />
                <button
                  onClick={challengeFriend}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  ⚔️ Challenge Friend
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {/* <div className="bg-white p-6 mt-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h3 className="text-lg font-semibold mb-4">📊 Leaderboard</h3>
        {leaderboard.length > 0 ? (
          <ul className="space-y-2">
            {leaderboard.map((user, index) => (
              <li key={index} className="p-2 border-b flex justify-between">
                <span>{user.username}</span>
                <span className="text-blue-500">{user.points} pts</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No leaderboard data available.</p>
        )}
      </div> */}
    </div>
  );
};

export default GamificationDashboard;
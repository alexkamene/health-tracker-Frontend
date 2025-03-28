"use client";
import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/forgotpassword", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to send reset email.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">🔑 Forgot Password</h2>
      {message && <p className="text-center text-green-500">{message}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <input
          type="email"
          placeholder="Enter your email"
          className="p-2 border rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 rounded w-full">
          📩 Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

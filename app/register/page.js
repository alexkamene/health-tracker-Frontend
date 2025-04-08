"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirmation
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState("");
  const router = useRouter();

  // Fetch user's IP address
  useEffect(() => {
    axios
      .get("https://api64.ipify.org?format=json")
      .then((res) => setIp(res.data.ip))
      .catch((err) => console.error("Error fetching IP:", err));
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/pages/dashboard");
    }
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Password confirmation check
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      toast.error("❌ Passwords do not match!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      const res = await axios.post("https://heath-tracker-backend.onrender.com/api/register", {
        username,
        email,
        password,
        ip,
      });

      setLoading(false);
      toast.success("🎉 Registration successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => router.push("/login"), 3000); // Redirect after toast
    } catch (err) {
      setLoading(false);
      const errorMsg = err.response?.data?.message || "Registration failed. Try again.";
      setError(errorMsg);
      toast.error(`❌ ${errorMsg}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="w-96 h-96 bg-green-200 rounded-full absolute -top-48 -left-48 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-teal-200 rounded-full absolute -bottom-48 -right-48 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

      {/* Register Card */}
      <div className="relative z-10 bg-white p-8 md:p-10 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-500 hover:shadow-2xl animate-fade-in-up">
        <h2 className="text-3xl font-bold text-center mb-3 text-green-700">
          Join <span className="text-blue-600">Health Tracker</span>
        </h2>
        <p className="text-teal-600 mb-6 text-center font-medium">
          Sign up to kickstart your personalized health journey!
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4 animate-fade-in">{error}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Username Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-green-500 group-hover:text-blue-600 transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full pl-10 pr-4 py-3 bg-green-50 border border-green-300 rounded-lg text-green-800 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-green-500 group-hover:text-blue-600 transition-colors duration-300" />
            </div>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full pl-10 pr-4 py-3 bg-green-50 border border-green-300 rounded-lg text-green-800 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-green-500 group-hover:text-blue-600 transition-colors duration-300" />
            </div>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full pl-10 pr-4 py-3 bg-green-50 border border-green-300 rounded-lg text-green-800 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-green-500 group-hover:text-blue-600 transition-colors duration-300" />
            </div>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full pl-10 pr-4 py-3 bg-green-50 border border-green-300 rounded-lg text-green-800 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold md:text-lg text-sm shadow-md hover:from-green-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
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
                Registering...
              </span>
            ) : (
              <>
                Sign Up <FiArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 md:text-xl text-sm text-center">
          <p className="text-blue-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-300"
            >
              Log In Now
            </Link>
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animate-fade-in { animation: fadeInUp 0.5s ease-out; }
      `}</style>
    </div>
  );
}
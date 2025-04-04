"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiArrowRight, FiKey } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState("");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [userId, setUserId] = useState(""); // Store userId for 2FA step
  const router = useRouter();

  useEffect(() => {
    axios
      .get("https://api64.ipify.org?format=json")
      .then((res) => setIp(res.data.ip))
      .catch((err) => console.error("Error fetching IP:", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/pages/dashboard");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = show2FAModal
        ? { email, password, ip, twoFactorCode, userId } // Include userId and 2FA code
        : { email, password, ip }; // Initial login attempt

      const res = await axios.post("https://heath-tracker-backend.onrender.com/api/login", payload);

      if (res.data.twoFactorRequired) {
        setShow2FAModal(true);
        setUserId(res.data.userId); // Store userId for next step
        setLoading(false);
      } else {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("username", res.data.username);

        setLoading(false);
        router.push("/pages/dashboard");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed. Please try again.");
      if (show2FAModal) setShow2FAModal(false); // Close modal on error after 2FA attempt
    }
  };

  const closeModal = () => {
    setShow2FAModal(false);
    setTwoFactorCode("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-96 h-96 bg-green-200 rounded-full absolute -top-48 -left-48 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-indigo-200 rounded-full absolute -bottom-48 -right-48 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-500 hover:shadow-2xl animate-fade-in-up">
        <h2 className="md:text-3xl text-lg font-bold text-gray-900 mb-3 text-center">
          Welcome Back to <span className="text-green-600">Health Tracker</span>
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Log in to unlock your personalized health journey.
        </p>

        {error && !show2FAModal && (
          <p className="text-red-500 text-sm text-center mb-4 animate-fade-in">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-500 group-hover:text-green-600 transition-colors" />
            </div>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-500 group-hover:text-green-600 transition-colors" />
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 md:text-xl text-white py-3 rounded-lg font-semibold text-sm shadow-md hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
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
                {show2FAModal ? "Verifying..." : "Logging in..."}
              </span>
            ) : (
              <>
                Log In <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center md:text-xl text-sm">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
              Sign Up Now
            </Link>
          </p>
        </div>

        <div className="mt-2 text-center">
          <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-green-600 transition-colors">
            Forgot your password?
          </Link>
        </div>
      </div>

      {show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Two-Factor Authentication
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Enter the code from your authenticator app.
            </p>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4 animate-fade-in">{error}</p>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiKey className="text-gray-500 group-hover:text-green-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Enter 2FA Code"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  required
                  maxLength={6}
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
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
                      Verifying...
                    </span>
                  ) : (
                    <>
                      Verify <FiArrowRight />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
}
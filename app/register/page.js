"use client"; // Required for Next.js client-side rendering
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState("");
  const router = useRouter();

  // ✅ Get user's IP address
  useEffect(() => {
    axios.get("https://api64.ipify.org?format=json")
      .then(res => setIp(res.data.ip))
      .catch(err => console.error("Error fetching IP:", err));
  }, []);

  // ✅ Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/pages/dashboard"); // Redirect to dashboard if token exists
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("https://heath-tracker-backend.onrender.com/api/register", {
        username,
        email,
        password,
        ip,
      });

      setLoading(false);
      router.push("/login"); // Redirect to login after successful registration
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="relative z-10 bg-white p-10 rounded-xl shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold mb-3">Create an Account</h2>
        <p className="text-gray-500 mb-4">Sign up to start tracking your health.</p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex items-center border rounded-lg p-2">
            <span className="text-gray-500 mr-2">
              <FiUser />
            </span>
            <input
              type="text"
              placeholder="Enter your Username"
              className="flex-1 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg p-2">
            <span className="text-gray-500 mr-2">
              <FiMail />
            </span>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg p-2">
            <span className="text-gray-500 mr-2">
              <FiLock />
            </span>
            <input
              type="password"
              placeholder="Enter your password"
              className="flex-1 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

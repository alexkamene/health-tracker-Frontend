"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiKey, FiArrowRight } from "react-icons/fi";

export default function Setup2FAPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetup = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await axios.post(
        "https://heath-tracker-backend.onrender.com/api/setup-2fa",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQrCodeUrl(res.data.qrCodeUrl);
      setSecret(res.data.secret);
      setMessage("Scan the QR code with your authenticator app.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://heath-tracker-backend.onrender.com/api/verify-2fa",
        { twoFactorCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      setTimeout(() => router.push("/pages/dashboard"), 2000); // Redirect after success
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to verify 2FA code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-green-50 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="w-96 h-96 bg-green-200 rounded-full absolute -top-48 -left-48 opacity-20 animate-blob"></div>
        <div className="w-96 h-96 bg-indigo-200 rounded-full absolute -bottom-48 -right-48 opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* 2FA Setup Card */}
      <div className="relative z-10 bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-500 hover:shadow-2xl animate-fade-in-up">
        <h2 className="md:text-3xl text-lg font-bold text-gray-900 mb-3 text-center">
          Enable <span className="text-green-600">Two-Factor Authentication</span>
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Secure your account with an extra layer of protection.
        </p>

        {message && (
          <p
            className={`text-sm text-center mb-4 animate-fade-in ${
              message.includes("Failed") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        {!qrCodeUrl ? (
          <button
            onClick={handleSetup}
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
                Generating...
              </span>
            ) : (
              <>
                Generate QR Code <FiArrowRight />
              </>
            )}
          </button>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
            </div>
            <p className="text-gray-600 text-center text-sm">
              Manual Secret: <span className="font-mono">{secret}</span>
            </p>

            <form onSubmit={handleVerify} className="space-y-6">
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
                    Verifying...
                  </span>
                ) : (
                  <>
                    Verify & Enable 2FA <FiArrowRight />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
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
      `}</style>
    </div>
  );
}
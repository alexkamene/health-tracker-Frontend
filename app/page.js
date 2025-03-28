"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiFacebook, FiLinkedin, FiTwitter, FiYoutube, FiArrowRight } from "react-icons/fi";

export default function Home() {
  const [email, setEmail] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", // Fitness
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop", // Yoga
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop", // Healthy eating
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <>
      {/* Hero Section with Animated Image Wiper */}
      <div className="bg-gradient-to-br from-indigo-50 to-green-50 text-center py-20 px-6 md:px-12 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl md:text-5xl text-gray-900 font-bold leading-tight animate-fade-in-down">
          Take Control of Your <span className="text-green-600">Health</span>
        </h1>
        <p className="mt-6 text-gray-700 text-lg md:text-xl max-w-3xl animate-fade-in-up">
          Track your fitness, monitor your wellness, and achieve your goals with Health Tracker – your all-in-one companion for a healthier life.
        </p>

        {/* Image Wiper */}
        <div className="mt-10 relative w-full max-w-2xl h-64 md:h-96 overflow-hidden rounded-xl shadow-lg">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                index === currentImage
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-full"
              }`}
              alt={`Health lifestyle ${index + 1}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t bottom-0 from-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white text-sm md:text-lg font-semibold">
            {currentImage === 0 ? "Power Up Your Fitness" : currentImage === 1 ? "Find Your Zen" : "Fuel Your Body"}
          </div>
        </div>

        {/* Call to Action with Animation */}
        <div className="mt-8 flex gap-4 animate-fade-in-up">
          <Link href="/register">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition duration-300 flex items-center gap-2 hover:scale-105">
              Get Started <FiArrowRight />
            </button>
          </Link>
          <Link href="/login">
            <button className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold text-lg transition duration-300 hover:scale-105">
              Log In
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section with Hover Animation */}
      <div className="py-16 px-6 md:px-12 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 animate-fade-in">
          Why Choose Health Tracker?
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-indigo-50 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <img
              src="https://img.icons8.com/ios-filled/50/000000/running.png"
              alt="Activity Tracking"
              className="w-12 h-12 mx-auto mb-4 animate-bounce-slow"
            />
            <h3 className="text-xl font-semibold text-indigo-600">Activity Tracking</h3>
            <p className="mt-2 text-gray-600">
              Log your steps, workouts, and calories burned effortlessly.
            </p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <img
              src="https://img.icons8.com/ios-filled/50/000000/heart-health.png"
              alt="Health Insights"
              className="w-12 h-12 mx-auto mb-4 animate-bounce-slow"
            />
            <h3 className="text-xl font-semibold text-green-600">Health Insights</h3>
            <p className="mt-2 text-gray-600">
              Get personalized insights to improve your wellness.
            </p>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg shadow-md text-center transform transition duration-300 hover:scale-105">
            <img
              src="https://img.icons8.com/ios-filled/50/000000/goal.png"
              alt="Goal Setting"
              className="w-12 h-12 mx-auto mb-4 animate-bounce-slow"
            />
            <h3 className="text-xl font-semibold text-purple-600">Goal Setting</h3>
            <p className="mt-2 text-gray-600">
              Set and track fitness goals with real-time progress updates.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section with Slide-In Animation */}
      <div className="py-16 px-6 md:px-12 bg-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 animate-fade-in">
          What Our Users Say
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md animate-slide-in-left">
            <p className="text-gray-600 italic">
              "Health Tracker helped me lose 15 pounds by keeping me motivated and on track!"
            </p>
            <p className="mt-4 text-gray-900 font-semibold">– Sarah M.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md animate-slide-in-right">
            <p className="text-gray-600 italic">
              "The insights and reminders are a game-changer for my daily routine."
            </p>
            <p className="mt-4 text-gray-900 font-semibold">– James K.</p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner with Pulse Animation */}
      <div className="bg-green-600 text-white py-12 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold animate-pulse-slow">
          Ready to Start Your Health Journey?
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Join thousands of users who’ve transformed their lives with Health Tracker.
        </p>
        <Link href="/signup">
          <button className="mt-6 bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition duration-300 hover:scale-105 animate-fade-in-up">
            Create Your Free Account
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-lg font-semibold mb-4 animate-fade-in">Stay Updated with Health Tips</h3>
          <form onSubmit={handleSubscribe} className="flex justify-center items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 w-64 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 animate-fade-in-up"
              required
            />
            <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold transition duration-300 hover:scale-105 animate-fade-in-up">
              Subscribe
            </button>
          </form>
        </div>

        <div className="max-w-6xl mx-auto mt-10 flex flex-col md:flex-row items-center justify-between text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white animate-fade-in">💙 Health Tracker</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-sm mt-4 md:mt-0 animate-fade-in-up">
            <a href="#" className="hover:text-white">Pricing</a>
            <a href="#" className="hover:text-white">About Us</a>
            <a href="#" className="hover:text-white">Features</a>
            <a href="#" className="hover:text-white">Help Center</a>
            <a href="#" className="hover:text-white">Contact Us</a>
            <a href="#" className="hover:text-white">FAQs</a>
            <a href="#" className="hover:text-white">Blog</a>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
          <div className="flex items-center gap-2 animate-fade-in">
            <select className="bg-gray-800 text-white px-2 py-1 rounded-md border border-gray-600">
              <option>English</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>
          <p className="mt-4 md:mt-0 animate-fade-in-up">
            © 2025 Health Tracker • <a href="#" className="hover:text-white">Privacy</a> •{" "}
            <a href="#" className="hover:text-white">Terms</a> •{" "}
            <a href="#" className="hover:text-white">Sitemap</a>
          </p>
          <div className="flex gap-4 mt-4 md:mt-0 animate-fade-in-up">
            <a href="#" className="hover:text-white"><FiTwitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white"><FiFacebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white"><FiLinkedin className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white"><FiYoutube className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>

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
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-fade-in-down { animation: fadeInDown 1s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 1s ease-out; }
        .animate-slide-in-left { animation: slideInLeft 1s ease-out; }
        .animate-slide-in-right { animation: slideInRight 1s ease-out; }
        .animate-bounce-slow { animation: bounceSlow 2s infinite; }
        .animate-pulse-slow { animation: pulseSlow 2s infinite; }
        .animate-fade-in { animation: fadeInDown 1s ease-out; }
      `}</style>
    </>
  );
}
"use client";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-green-50 text-center py-20 px-6 md:px-12 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl md:text-5xl text-gray-900 font-bold leading-tight">
          About <span className="text-green-600">Health Tracker</span>
        </h1>
        <p className="mt-6 text-gray-700 text-lg md:text-xl max-w-3xl">
          We’re on a mission to empower everyone to live healthier, happier lives through personalized tracking and actionable insights.
        </p>

        {/* Hero Image */}
        <div className="mt-10">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
            className="rounded-xl h-###-64 md:h-96 w-full max-w-3xl object-cover shadow-lg"
            alt="Team working on health app"
          />
        </div>

        {/* Call to Action */}
        <div className="mt-8">
          <Link href="/signup">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition duration-300 flex items-center gap-2 mx-auto">
              Join Us Today <FiArrowRight />
            </button>
          </Link>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 px-6 md:px-12 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Our Story
        </h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 text-lg">
            Health Tracker was born from a simple idea: everyone deserves the tools to understand and improve their health. Founded by a team of fitness enthusiasts, doctors, and tech experts, we combined our expertise to create an app that’s both powerful and easy to use. Whether you’re training for a marathon or just starting your wellness journey, we’re here to support you every step of the way.
          </p>
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca3b11b9?q=80&w=2070&auto=format&fit=crop"
            className="mt-8 rounded-lg h-64 md:h-80 w-full object-cover shadow-md"
            alt="Team collaboration"
          />
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-16 px-6 md:px-12 bg-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Our Mission
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-600 mb-4">Empowerment</h3>
            <p className="text-gray-600">
              We believe knowledge is power. Our app gives you the data and insights you need to make informed decisions about your health.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-600 mb-4">Accessibility</h3>
            <p className="text-gray-600">
              Health tools should be for everyone. That’s why we offer a free, user-friendly platform with premium features to enhance your experience.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-6 md:px-12 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Meet Our Team
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=387&auto=format&fit=crop"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md"
              alt="Team member 1"
            />
            <h3 className="text-lg font-semibold text-gray-900">Dr. Emily Chen</h3>
            <p className="text-gray-600">Chief Medical Officer</p>
          </div>
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=387&auto=format&fit=crop"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md"
              alt="Team member 2"
            />
            <h3 className="text-lg font-semibold text-gray-900">Mark Johnson</h3>
            <p className="text-gray-600">Lead Developer</p>
          </div>
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-539ccf85e11e?q=80&w=387&auto=format&fit=crop"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md"
              alt="Team member 3"
            />
            <h3 className="text-lg font-semibold text-gray-900">Sarah Lee</h3>
            <p className="text-gray-600">Fitness Expert</p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-green-600 text-white py-12 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Be Part of Our Health Revolution
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Join a growing community dedicated to better health and well-being.
        </p>
        <Link href="/register">
          <button className="mt-6 bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition duration-300">
            Get Started Now
          </button>
        </Link>
      </div>
    </>
  );
}
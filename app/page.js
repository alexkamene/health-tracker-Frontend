"use client";

import Link from "next/link";
import { useState } from "react";
import { FiFacebook, FiLink2, FiLinkedin, FiTwitter, FiYoutube } from "react-icons/fi";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="text-center mt-20 mx-6 md:mx-56 flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-4xl text-gray-900 font-medium">
          Welcome to Health Tracking
        </h1>

        <p className="mt-6 text-gray-700 text-lg max-w-2xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem,
          blanditiis. Quasi, dolor assumenda ipsam non cupiditate dolorem maxime? Similique,
          impedit tenetur corrupti explicabo id nemo qui aut repellendus in maxime.
        </p>

        {/* Banner Image */}
        <div className="mt-10">
          <img
            src="im.webp"
            className="rounded-lg h-80 w-[550px] object-cover shadow-lg"
            alt="Banner"
          />
        </div>

        {/* Get Started Button */}
        <div className="mt-6">

          <Link href="/login">
            <button className="bg-green-600 hover:bg-green-700 transition duration-300 px-8 py-2 rounded-lg text-white font-semibold text-lg shadow-md">
              Get Started
            </button>

          </Link>
        </div>
      </div>

      {/* Newsletter Section */}
      <footer className="bg-gray-900 text-white py-10 mt-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-lg font-semibold mb-4">Subscribe to our newsletter</h3>
          <div className="flex justify-center items-center gap-2">
            <input
              type="email"
              placeholder="Input your email"
              className="px-4 py-2 w-64 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none"
            />
            <button className="bg-green-500 hover:bg-green-300 text-white md:px-5 py-2 rounded-lg font-semibold">
              Subscribe
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 flex flex-col md:flex-row items-center justify-between text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">💙 Health Tracker</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-sm mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Pricing</a>
            <a href="#" className="hover:text-white">About us</a>
            <a href="#" className="hover:text-white">Features</a>
            <a href="#" className="hover:text-white">Help Center</a>
            <a href="#" className="hover:text-white">Contact us</a>
            <a href="#" className="hover:text-white">FAQs</a>
            <a href="#" className="hover:text-white">Careers</a>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <select className="bg-gray-800 text-white px-2 py-1 rounded-md border border-gray-600">
              <option>English</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>
          <p className="mt-4 md:mt-0">© 2025 Lex Softwarre • <a href="#" className="hover:text-white">Privacy</a> • <a href="#" className="hover:text-white">Terms</a> • <a href="#" className="hover:text-white">Sitemap</a></p>

          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white"><i className="fab fa-twitter"></i><FiTwitter /></a>
            <a href="#" className="hover:text-white"><i className="fab fa-facebook"></i><FiFacebook /></a>
            <a href="#" className="hover:text-white"><i className="fab fa-linkedin"></i><FiLinkedin /></a>
            <a href="#" className="hover:text-white"><i className="fab fa-youtube"></i><FiYoutube /></a>
          </div>
        </div>

      </footer>
    </>
  );
}

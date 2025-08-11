import React from "react";
import { motion } from "framer-motion";
import hspiimg from '../assets/hspi.avif'
export default function HeroSection() {
  return (
    <div
      className="relative h-screen bg-cover bg-center
                 bg-{hspimg}"
    >
      {/* Light blur overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-md"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-gray-900 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Lief App
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">
          Your health, our priority. Managing hospital workflows with ease.
        </p>
        <motion.button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
}

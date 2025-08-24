"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="w-full bg-gradient-to-b from-white to-blue-50 dark:from-neutral-900 dark:to-neutral-950 py-16 px-6 md:px-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6 leading-tight">
            About <span className="text-purple-600 dark:text-purple-400">Yatra AI</span>
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
            Yatra AI is your 
            <span className="text-purple-600 dark:text-purple-400"> smart AI-powered travel planner</span>
            , designed to make
            trip planning seamless. With cutting-edge artificial intelligence, we 
            curate personalized itineraries, destinations, and travel experiences 
            tailored to your preferences — in just a few clicks.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6">
            Whether you are an adventure seeker , craving mountains, or someone 
            who enjoys relaxation by the beach, Yatra AI ensures your journey 
            is smooth, enjoyable, and unforgettable. Say goodbye to stress and 
            hello to your perfect AI-planned getaway.
          </p>
          <Link href="/create-new-trip">
            <button className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-medium shadow-md hover:bg-purple-800 transition-all duration-300 hover:scale-105">
              🚀 Start Planning
            </button>
          </Link>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="/assets/About-ai.jpg"
            alt="About Yatra AI"
            width={500}
            height={400}
            className="rounded-2xl shadow-xl"
          />
        </motion.div>
      </div>

      {/* Owner / Founder Section */}
      <section className="max-w-4xl mx-auto mt-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-6">
            Meet the Creator
          </h2>
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-purple-200 dark:border-purple-600
                  transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
              <Image
                src="/assets/owner.jpg"
                alt="Owner of Yatra AI"
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-purple-700 dark:text-blue-400">
              Sourav Sahoo
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mt-3">
              Hi 👋 I’m <b>Sourav</b>, the creator of <b>Yatra AI</b>.  
              As a passionate full-stack developer and traveler at heart, I built this
              app to help people save time and enjoy hassle-free travel planning.  
              My mission is to merge technology and travel for an unforgettable experience.
            </p>
            <div className="flex gap-4 mt-6">
              <Link href="https://github.com/Souravsahoo2004" target="_blank">
                <button className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition">
                  GitHub
                </button>
              </Link>
              <Link href="https://www.linkedin.com/in/sourav-sahoo-2004" target="_blank">
                <button className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-800 transition">
                  LinkedIn
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

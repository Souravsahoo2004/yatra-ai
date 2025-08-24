"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Destinations with Yatra AI",
    excerpt: "Discover the most trending travel spots curated by Yatra AI.",
    image: "/blog/Chardham.jpg",
    author: "Sourav Sahoo",
    date: "Aug 20, 2025",
    slug: "top-10-destinations-yatra-ai",
  },
  {
    id: 2,
    title: "How AI is Transforming Travel Planning",
    excerpt: "Explore how AI tools simplify itinerary planning and booking.",
    image: "/blog/travel-planning.jpg",
    author: "Yatra AI Team",
    date: "Aug 15, 2025",
    slug: "ai-transforming-travel-planning",
  },
  {
    id: 3,
    title: "Budget-Friendly Trips with Smart AI",
    excerpt: "Learn how Yatra AI helps you save money on trips.",
    image: "/blog/OIP.jpg",
    author: "Sourav Sahoo",
    date: "Aug 10, 2025",
    slug: "budget-friendly-trips-yatra-ai",
  },
];

export default function BlogPage() {
  const [search, setSearch] = useState("");

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16 px-6 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Yatra AI Blog
        </motion.h1>
        <p className="text-lg md:text-xl opacity-90">
          Explore travel stories, AI tips & destination guides
        </p>
      </section>

      {/* Search Bar */}
      <div className="flex justify-center mt-8 px-4">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                       placeholder-gray-500 dark:placeholder-gray-400 
                       focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Blog Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg overflow-hidden transition-colors"
            >
              <Image
                src={post.image}
                alt={post.title}
                width={500}
                height={300}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span>✍ {post.author}</span>
                  <span>{post.date}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition">
                    Read More
                  </button>
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-3">
            No blog posts found.
          </p>
        )}
      </section>
    </div>
  );
}

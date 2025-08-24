// app/blog/[slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Destinations with Yatra AI",
    content: `
      Discover the most trending travel spots curated by Yatra AI.
      From beaches to mountains, AI helps you find the perfect destination.
      Explore breathtaking locations and plan smarter trips.
    `,
    image: "/blog/Chardham.jpg",
    author: "Sourav Sahoo",
    date: "Aug 20, 2025",
    slug: "top-10-destinations-yatra-ai",
  },
  {
    id: 2,
    title: "How AI is Transforming Travel Planning",
    content: `
      AI is changing the way we plan trips. Yatra AI creates itineraries,
      finds the best deals, and helps you travel stress-free.
      Experience the future of travel planning today.
    `,
    image: "/blog/travel-planning.jpg",
    author: "Yatra AI Team",
    date: "Aug 15, 2025",
    slug: "ai-transforming-travel-planning",
  },
  {
    id: 3,
    title: "Budget-Friendly Trips with Smart AI",
    content: `
      Travel doesn't have to be expensive. Yatra AI suggests affordable trips,
      budget stays, and local experiences so you can save money while exploring.
    `,
    image: "/blog/OIP.jpg",
    author: "Sourav Sahoo",
    date: "Aug 10, 2025",
    slug: "budget-friendly-trips-yatra-ai",
  },
];

export default async function BlogDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {post.title}
        </h1>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>✍ {post.author}</span>
          <span>{post.date}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>
    </div>
  );
}

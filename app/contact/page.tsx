"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";  // ✅ Clerk hook

export default function ContactPage() {
  const { user } = useUser();
  const [form, setForm] = useState({ name: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name || user?.fullName || "Anonymous",
          email: user?.primaryEmailAddress?.emailAddress,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", message: "" });
      } else {
        setStatus("❌ Failed to send. Try again later.");
      }
    } catch (err) {
      setStatus("❌ Error occurred.");
    }
  };

  return (
    <main className="w-full py-16 px-6 md:px-20 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Contact Yatra AI
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md space-y-6 transition-colors"
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* ✅ Email input removed since Clerk email is used */}

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Your Message"
            required
            className="w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
          >
            Send Message
          </button>
        </form>
        {status && (
          <p className="mt-4 text-gray-800 dark:text-gray-200">{status}</p>
        )}
      </div>
    </main>
  );
}

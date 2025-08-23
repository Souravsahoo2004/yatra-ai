"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";  // ✅ Import Clerk hook

export default function ContactPage() {
  const { user } = useUser(); // ✅ Get logged-in user
  const [form, setForm] = useState({ name: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          email: user?.primaryEmailAddress?.emailAddress, // ✅ Always Clerk email
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
    <main className="w-full py-16 px-6 md:px-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Contact Yatra AI</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md space-y-6">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-3 border rounded-xl"
          />

          {/* ✅ Removed email input (since we use Clerk email) */}

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Your Message"
            required
            className="w-full px-4 py-3 border rounded-xl"
          />

          <button type="submit" className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl">
            Send Message
          </button>
        </form>
        {status && <p className="mt-4">{status}</p>}
      </div>
    </main>
  );
}

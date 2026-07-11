"use client";

import { useState } from "react";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Message sent successfully! We will get back to you soon." });
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
      } else {
        setStatus({ type: "error", message: data.error || "Failed to send message." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-800 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        {status && (
          <div className={`p-4 rounded-xl text-sm font-medium ${status.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {status.message}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name" 
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@email.com" 
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none" 
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
          <select 
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none"
          >
            <option>General Inquiry</option>
            <option>Order Support</option>
            <option>Affiliate Partnership</option>
            <option>Press & Media</option>
            <option>Bug Report</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Message</label>
          <textarea 
            rows={5} 
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Your message..." 
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none resize-none" 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
        <p className="text-xs text-gray-400 text-center">We typically respond within 1–2 business days.</p>
      </form>

      {/* Fake Email Hatakar Sirf Response Time Rakha Hai */}
      <div className="mt-6 grid sm:grid-cols-1 gap-4 text-sm text-gray-600">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="font-semibold text-gray-800 mb-1">⏰ Response Time</div>
          <div>Within 1–2 business days</div>
        </div>
      </div>
    </div>
  );
}

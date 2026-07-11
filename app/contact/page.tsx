"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, Send, Loader2, ShieldCheck, MailPlus } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("idle");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      setStatus("idle");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-black text-gray-800 mb-2">Contact ShopPeak</h1>
        <p className="text-gray-500">Have a question or need help? We&apos;d love to hear from you.</p>
      </motion.div>

      {/* Info Cards Grid (Fake Email Removed) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: <MailPlus className="text-orange-500" size={20} />, title: "Direct Route", desc: "Instant Gateway", sub: "Form routes via Resend secure pipe" },
          { icon: <ShieldCheck className="text-blue-500" size={20} />, title: "Verified Response", desc: "Direct to Box", sub: "Delivered straight to administrator" },
          { icon: <Clock className="text-green-500" size={20} />, title: "Response Time", desc: "24–48 hours", sub: "Mon–Fri, 9am–6pm UTC" },
        ].map(item => (
          <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-xs">
            <div className="flex justify-center mb-2">{item.icon}</div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">{item.title}</h3>
            <p className="text-sm text-orange-500 font-semibold">{item.desc}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Form Block with Smooth Transitions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs min-h-[380px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            // Premium Professional Thanks & Check State
            <motion.div 
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 flex flex-col items-center justify-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle2 className="text-green-500 mb-4" size={56} />
              </motion.div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">Thank You, Message Sent!</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                We have successfully received your submission. Our technical support team will process it and reach out to your provided email address within 24-48 hours.
              </p>
              <button 
                onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }} 
                className="text-orange-500 text-sm font-semibold hover:underline"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            // Interactive Form Input State
            <motion.div
              key="form-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Send Us a Message</h2>
              
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Your Name *</label>
                    <input 
                      required 
                      value={form.name} 
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))} 
                      type="text" 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-all" 
                      placeholder="John Smith" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Email Address *</label>
                    <input 
                      required 
                      value={form.email} 
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))} 
                      type="type" 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-all" 
                      placeholder="john@email.com" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Subject *</label>
                  <select 
                    required 
                    value={form.subject} 
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 bg-white transition-all"
                  >
                    <option value="">Select a subject...</option>
                    <option>Product Question</option>
                    <option>Order Issue</option>
                    <option>Partnership / Business</option>
                    <option>Technical Issue</option>
                    <option>Affiliate Program</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Message *</label>
                  <textarea 
                    required 
                    value={form.message} 
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))} 
                    rows={5} 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 resize-none transition-all" 
                    placeholder="How can we help you?" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? (
                    <><Loader2 className="animate-spin" size={18} /> Processing Request...</>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Affiliate Policy Warning Notice */}
      <div className="mt-6 bg-orange-50 rounded-xl p-4 text-sm text-gray-600 text-center">
        <p>For order-related issues, please contact AliExpress directly through your order page.</p>
        <p className="text-xs text-gray-400 mt-1">ShopPeak is an affiliate platform — we do not process orders directly.</p>
      </div>
    </div>
  );
}

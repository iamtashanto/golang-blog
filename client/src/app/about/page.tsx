"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Send } from "lucide-react";

export default function AboutPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    setStatus(null);
    try {
      const res = await api.post("/contact", {
        name,
        email,
        subject,
        message,
      });
      setStatus({ type: "success", text: res.data.message || "Your letter has been received." });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setStatus({
        type: "error",
        text: err.response?.data?.error || "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 font-serif">
      <div className="border-b border-neutral-300 pb-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-black font-serif"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Chronicle</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#162f4d] mt-4">
          About The Chronicle
        </h1>
        <p className="text-xs font-semibold tracking-[0.2em] text-[#64748b] uppercase font-sans mt-1">
          A journal of family, faith, culture, and enduring software craft
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base font-serif text-[#334155] leading-relaxed">
        <div className="h-64 sm:h-80 w-full bg-neutral-100 border border-[#cbd5e1] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80"
            alt="Printing press & books"
            className="w-full h-full object-cover grayscale contrast-110"
          />
        </div>

        <p className="first-letter:text-5xl first-letter:font-bold first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:leading-none text-neutral-900">
          The Castle Chronicle is an independent journal dedicated to timeless reflections on family, faith, culture, and the quiet dignity of enduring craft in an accelerating world.
        </p>

        <p>
          In an era captivated by ephemeral noise and restless novelty, we choose to write about the foundations that endure: household memory, generational conversation, historical curiosities, and the enduring truths tested by time.
        </p>

        <blockquote className="border-l-2 border-[#162f4d] pl-4 py-1 italic text-neutral-600 my-6">
          &ldquo;Simplicity and truth are the prerequisites for enduring craft.&rdquo;
        </blockquote>

        <p>
          Each essay is published with care, focusing on depth, clarity, and the quiet beauty of ordinary life.
        </p>
      </div>

      {/* Interactive Contact & Correspondence Section */}
      <div id="contact" className="pt-8 border-t border-neutral-300 space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#162f4d]">
            Editorial Correspondence
          </h3>
          <p className="text-xs text-[#64748b] font-serif leading-relaxed mt-1">
            Letters to the editor, reflections, or inquiries are warmly received. Send your message directly to our desk below.
          </p>
        </div>

        {status && (
          <div
            className={`p-3.5 border text-xs font-sans flex items-center space-x-2 ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{status.text}</span>
          </div>
        )}

        <form onSubmit={handleContactSubmit} className="space-y-4 font-sans text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] focus:outline-none focus:border-[#162f4d]"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] focus:outline-none focus:border-[#162f4d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Regarding Sundays at the Round Oak Table"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] focus:outline-none focus:border-[#162f4d]"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Your Letter / Remarks *
            </label>
            <textarea
              rows={5}
              placeholder="Write your message to the editor..."
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] focus:outline-none focus:border-[#162f4d] font-serif leading-relaxed"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#162f4d] hover:bg-[#0f233a] text-white text-xs font-semibold tracking-wider uppercase transition flex items-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? "Transmitting..." : "Send Correspondence"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

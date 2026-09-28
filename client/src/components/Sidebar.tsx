"use client";

import { useState } from "react";
import Link from "next/link";
import { CategoryCount, Post, SiteSetting } from "@/types";
import { api } from "@/lib/api";
import { Search, Rss, Square, History, Calendar } from "lucide-react";

interface SidebarProps {
  categories: CategoryCount[];
  posts?: Post[];
  settings?: SiteSetting | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit?: () => void;
}

export default function Sidebar({
  categories,
  posts = [],
  settings,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}: SidebarProps) {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subMsg, setSubMsg] = useState<string | null>(null);
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubscribing(true);
    setSubMsg(null);
    try {
      const res = await api.post("/newsletter", { email });
      setSubMsg(res.data.message || "Successfully subscribed to the chronicle dispatch!");
      setEmail("");
      setTimeout(() => setShowEmailInput(false), 3000);
    } catch (err: any) {
      setSubMsg(err.response?.data?.error || "Failed to subscribe. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const authorName = settings?.author_name || "James Castle";
  const authorTitle = settings?.author_title || "Essayist, Father & Historian";
  const authorBio = settings?.author_bio || "Chronicling ordinary days, historic curiosities, and the enduring truths that anchor our households in an accelerating world.";
  const authorImage = settings?.author_image || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80";

  // Dynamic Categories fallback
  const displayCategories = categories.length > 0 ? categories : [
    { category: "Family", count: 42 },
    { category: "Faith", count: 89 },
    { category: "Culture", count: 34 },
    { category: "History", count: 57 },
    { category: "Commentary", count: 28 },
    { category: "Humor", count: 19 },
  ];

  // Dynamic History / Notable Posts from actual database posts
  const historyPosts = posts.length > 2 ? posts.slice(1, 4) : [
    {
      ID: 3,
      CreatedAt: "2026-07-18T15:00:00Z",
      title: "What the Town Clerk's Ledger of 1884 Forgot to Mention",
      summary: "Between the property tax disputes and cattle brand registrations sits a tiny penciled margin note...",
    },
    {
      ID: 4,
      CreatedAt: "2026-07-11T16:00:00Z",
      title: "The Quiet Dignity of Slow Machinery",
      summary: "Why our obsession with frictionless velocity is robbing small towns of craft, conversation...",
    },
    {
      ID: 5,
      CreatedAt: "2026-07-04T18:00:00Z",
      title: "Porch Lanterns and Fireflies: Small Town Independence Day",
      summary: "Before the synchronized drone spectacles, there was the single brass trumpet playing taps...",
    },
  ];

  // Dynamic Archives grouped by year
  const archiveYearsMap: Record<string, number> = {};
  posts.forEach((p) => {
    const yr = new Date(p.CreatedAt).getFullYear().toString();
    archiveYearsMap[yr] = (archiveYearsMap[yr] || 0) + 1;
  });

  const archiveEntries = Object.keys(archiveYearsMap).length > 0
    ? Object.keys(archiveYearsMap).sort((a, b) => parseInt(b) - parseInt(a)).map(yr => ({ year: yr, count: archiveYearsMap[yr] }))
    : [
        { year: "2026", count: 31 },
        { year: "2025", count: 64 },
        { year: "2024", count: 58 },
        { year: "2023", count: 72 },
        { year: "2022", count: 69 },
        { year: "2021", count: 54 },
      ];

  return (
    <aside className="space-y-8 font-serif">
      {/* 1. SEARCH THE CHRONICLE */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#475569] uppercase font-sans">
          Search The Chronicle
        </h4>
        <div className="relative">
          <input
            type="text"
            placeholder="Type keywords & press enter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSearchSubmit) onSearchSubmit();
            }}
            className="w-full px-3 py-2 text-xs bg-white border border-[#cbd5e1] rounded-none focus:outline-none focus:border-[#162f4d] placeholder:text-neutral-400 placeholder:italic font-serif"
          />
          <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      {/* 2. DYNAMIC AUTHOR PROFILE BOX */}
      <div className="bg-[#f0f4f8] border border-[#e2e8f0] p-6 text-center space-y-3.5 rounded-sm">
        {/* Engraving Artwork Portrait */}
        <div className="w-24 h-24 mx-auto border border-[#cbd5e1] bg-white p-1 shadow-sm overflow-hidden rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={authorImage}
            alt={`${authorName} portrait`}
            className="w-full h-full object-cover grayscale contrast-125"
          />
        </div>

        <div className="space-y-0.5">
          <h3 className="font-serif text-lg font-bold text-[#162f4d]">
            {authorName}
          </h3>
          <p className="text-[11px] italic text-[#64748b] font-serif">
            {authorTitle}
          </p>
        </div>

        <p className="text-xs text-[#334155] leading-relaxed font-serif px-1">
          {authorBio}
        </p>

        {subMsg && (
          <div className="text-[11px] font-sans p-2 bg-white border border-[#cbd5e1] text-[#162f4d]">
            {subMsg}
          </div>
        )}

        {showEmailInput ? (
          <form onSubmit={handleSubscribe} className="space-y-2 pt-1 font-sans">
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#cbd5e1] focus:outline-none focus:border-[#162f4d]"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="w-full py-1.5 bg-[#162f4d] hover:bg-[#0f233a] text-white text-[11px] font-semibold tracking-wider uppercase transition disabled:opacity-50"
            >
              {subscribing ? "Subscribing..." : "Confirm Subscription"}
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => setShowEmailInput(true)}
              className="w-full py-2 px-4 bg-[#162f4d] hover:bg-[#0f233a] text-white text-[11px] font-sans font-semibold tracking-wider transition flex items-center justify-center space-x-2 rounded-sm shadow-sm"
            >
              <Rss className="w-3.5 h-3.5" />
              <span>Subscribe via RSS / Dispatch</span>
            </button>
            <a
              href="http://localhost:8080/rss"
              target="_blank"
              rel="noreferrer"
              className="block text-[10px] text-[#64748b] hover:text-[#162f4d] underline font-sans"
            >
              View Raw XML Feed (/rss)
            </a>
          </div>
        )}
      </div>

      {/* 3. DYNAMIC CATEGORIES WIDGET */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#475569] uppercase font-sans">
            Categories
          </h4>
          <Square className="w-3.5 h-3.5 text-neutral-400" />
        </div>

        <div className="divide-y divide-neutral-100 text-xs">
          {displayCategories.map((cat) => (
            <Link
              key={cat.category}
              href={`/categories?selected=${encodeURIComponent(cat.category)}`}
              className="flex items-center justify-between py-2 text-[#334155] hover:text-[#162f4d] transition group"
            >
              <span className="font-serif group-hover:underline">{cat.category}</span>
              <span className="text-[10px] font-sans font-medium bg-[#f0f4f8] text-[#64748b] px-2 py-0.5 rounded">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. DYNAMIC THIS DAY IN HISTORY / ESSAYS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#475569] uppercase font-sans">
            This Day in History
          </h4>
          <History className="w-3.5 h-3.5 text-neutral-400" />
        </div>

        <p className="text-xs italic text-[#64748b] font-serif leading-snug">
          What was on our minds on July 29th across the decades:
        </p>

        <div className="space-y-2.5">
          {historyPosts.map((post, idx) => {
            const yearsAgo = 18 - idx * 4;
            const yearNum = 2026 - yearsAgo;
            return (
              <Link
                key={post.ID}
                href={`/posts/${post.ID}`}
                className="block bg-[#f0f4f8] p-3 rounded border border-[#e2e8f0]/80 space-y-0.5 hover:border-[#cbd5e1] transition"
              >
                <span className="text-[10px] font-sans font-medium text-[#64748b]">
                  {yearNum} • {yearsAgo} years ago
                </span>
                <h5 className="text-xs font-serif font-bold text-[#162f4d] hover:underline line-clamp-1">
                  {post.title}
                </h5>
                <p className="text-[11px] font-serif text-[#475569] line-clamp-1 italic">
                  {post.summary}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. DYNAMIC ARCHIVES TABLE WIDGET */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#475569] uppercase font-sans">
            Archives
          </h4>
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-serif text-[#334155]">
          {archiveEntries.map((arch) => (
            <Link
              key={arch.year}
              href={`/archive?year=${arch.year}`}
              className="flex items-center justify-between hover:underline"
            >
              <span>{arch.year}</span>
              <span className="text-neutral-400 font-sans text-[11px]">({arch.count})</span>
            </Link>
          ))}
        </div>

        <div className="pt-2">
          <Link
            href="/archive"
            className="text-xs font-serif font-bold text-[#162f4d] hover:underline"
          >
            View All Archives (2004–2026) →
          </Link>
        </div>
      </div>
    </aside>
  );
}

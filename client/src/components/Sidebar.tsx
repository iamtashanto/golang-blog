"use client";

import { useState } from "react";
import Link from "next/link";
import { CategoryCount, Post } from "@/types";
import { Search, Rss, Layers, Calendar, Clock, Bookmark, ArrowRight, BookOpen } from "lucide-react";

interface SidebarProps {
  categories: CategoryCount[];
  popularPosts?: Post[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit?: () => void;
}

export default function Sidebar({
  categories,
  popularPosts = [],
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}: SidebarProps) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <aside className="space-y-10">
      {/* 1. Search Box */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-bold tracking-[0.18em] text-neutral-800 uppercase font-sans">
          Search the Chronicle
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
            className="w-full px-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-none focus:outline-none focus:border-neutral-900 placeholder:text-neutral-400 placeholder:italic transition"
          />
          <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      {/* 2. Author Profile / Publication Box */}
      <div className="bg-[#f7f6f2] border border-neutral-200/90 p-6 text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-none border border-neutral-300 bg-white p-1 shadow-sm overflow-hidden">
          {/* Classic engraving style author portrait */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            alt="Author portrait"
            className="w-full h-full object-cover grayscale contrast-125"
          />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-neutral-900">
            Shanto & Contributors
          </h3>
          <p className="text-[11px] italic text-neutral-500 font-serif">
            Software Architect, Writer & Historian
          </p>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed font-serif px-1">
          Chronicling ordinary systems, concurrent Go design curiosities, and the enduring principles that anchor reliable engineering in an accelerating world.
        </p>

        <button
          onClick={() => setSubscribed(!subscribed)}
          className="w-full py-2 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-semibold tracking-wider uppercase transition flex items-center justify-center space-x-2 shadow-sm"
        >
          <Rss className="w-3.5 h-3.5" />
          <span>{subscribed ? "Subscribed to Feed" : "Subscribe via RSS"}</span>
        </button>
      </div>

      {/* 3. Categories Widget */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
          <h4 className="text-[11px] font-bold tracking-[0.18em] text-neutral-800 uppercase font-sans">
            Categories
          </h4>
          <Layers className="w-3.5 h-3.5 text-neutral-400" />
        </div>

        <div className="divide-y divide-neutral-100 text-xs font-serif">
          {categories.length === 0 ? (
            <p className="text-neutral-400 text-xs italic py-2">No categories yet.</p>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.category}
                href={`/categories?selected=${encodeURIComponent(cat.category)}`}
                className="flex items-center justify-between py-2.5 text-neutral-700 hover:text-neutral-950 transition-colors group"
              >
                <span className="group-hover:underline underline-offset-4">{cat.category}</span>
                <span className="text-[11px] text-neutral-400 font-sans">{cat.count}</span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* 4. Popular / Notable Articles Widget */}
      {popularPosts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <h4 className="text-[11px] font-bold tracking-[0.18em] text-neutral-800 uppercase font-sans">
              Notable Essays
            </h4>
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
          </div>

          <div className="space-y-4">
            {popularPosts.slice(0, 4).map((post) => (
              <article key={post.ID} className="space-y-1 bg-[#fbfbf9] p-3 border border-neutral-200/60">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-sans block">
                  {new Date(post.CreatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
                <Link
                  href={`/posts/${post.ID}`}
                  className="font-serif text-xs font-bold text-neutral-900 hover:underline block leading-snug line-clamp-2"
                >
                  {post.title}
                </Link>
                <p className="text-[11px] text-neutral-500 font-serif line-clamp-1 italic">
                  {post.summary || post.content}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* 5. Archives Widget */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
          <h4 className="text-[11px] font-bold tracking-[0.18em] text-neutral-800 uppercase font-sans">
            Archives
          </h4>
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-xs font-serif text-neutral-700">
          <Link href="/archive" className="hover:underline">2026 <span className="text-neutral-400 font-sans">(12)</span></Link>
          <Link href="/archive" className="hover:underline">2025 <span className="text-neutral-400 font-sans">(28)</span></Link>
          <Link href="/archive" className="hover:underline">2024 <span className="text-neutral-400 font-sans">(19)</span></Link>
          <Link href="/archive" className="hover:underline">2023 <span className="text-neutral-400 font-sans">(15)</span></Link>
        </div>

        <div className="pt-2">
          <Link
            href="/archive"
            className="text-[11px] font-semibold text-neutral-900 hover:underline flex items-center space-x-1"
          >
            <span>View All Archives (2023–2026)</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

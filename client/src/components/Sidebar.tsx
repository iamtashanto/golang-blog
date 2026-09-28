"use client";

import { useState } from "react";
import Link from "next/link";
import { CategoryCount } from "@/types";
import { Search, Rss, Square, History, Calendar } from "lucide-react";

interface SidebarProps {
  categories: CategoryCount[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit?: () => void;
}

export default function Sidebar({
  categories,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}: SidebarProps) {
  const [subscribed, setSubscribed] = useState(false);

  // Default category display list if database categories are empty/different
  const displayCategories = categories.length > 0 ? categories : [
    { category: "Family", count: 42 },
    { category: "Faith", count: 89 },
    { category: "Culture", count: 34 },
    { category: "History", count: 57 },
    { category: "Commentary", count: 28 },
    { category: "Humor", count: 19 },
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

      {/* 2. JAMES CASTLE AUTHOR PROFILE BOX */}
      <div className="bg-[#f0f4f8] border border-[#e2e8f0] p-6 text-center space-y-3.5 rounded-sm">
        {/* Engraving Artwork Portrait */}
        <div className="w-24 h-24 mx-auto border border-[#cbd5e1] bg-white p-1 shadow-sm overflow-hidden rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"
            alt="James Castle engraving portrait"
            className="w-full h-full object-cover grayscale contrast-125"
          />
        </div>

        <div className="space-y-0.5">
          <h3 className="font-serif text-lg font-bold text-[#162f4d]">
            James Castle
          </h3>
          <p className="text-[11px] italic text-[#64748b] font-serif">
            Essayist, Father & Historian
          </p>
        </div>

        <p className="text-xs text-[#334155] leading-relaxed font-serif px-1">
          Chronicling ordinary days, historic curiosities, and the enduring truths that anchor our households in an accelerating world.
        </p>

        <button
          onClick={() => setSubscribed(!subscribed)}
          className="w-full py-2 px-4 bg-[#162f4d] hover:bg-[#0f233a] text-white text-[11px] font-sans font-semibold tracking-wider transition flex items-center justify-center space-x-2 rounded-sm shadow-sm"
        >
          <Rss className="w-3.5 h-3.5" />
          <span>{subscribed ? "Subscribed to RSS" : "Subscribe via RSS"}</span>
        </button>
      </div>

      {/* 3. CATEGORIES WIDGET */}
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

      {/* 4. THIS DAY IN HISTORY */}
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
          {/* Card 1 */}
          <div className="bg-[#f0f4f8] p-3 rounded border border-[#e2e8f0]/80 space-y-0.5">
            <span className="text-[10px] font-sans font-medium text-[#64748b]">
              2008 • 18 years ago
            </span>
            <h5 className="text-xs font-serif font-bold text-[#162f4d]">
              Off to City Hall
            </h5>
            <p className="text-[11px] font-serif text-[#475569] line-clamp-1 italic">
              Filing building permits for the carriage house...
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f0f4f8] p-3 rounded border border-[#e2e8f0]/80 space-y-0.5">
            <span className="text-[10px] font-sans font-medium text-[#64748b]">
              2012 • 14 years ago
            </span>
            <h5 className="text-xs font-serif font-bold text-[#162f4d]">
              Summer Storms and Screen Porches
            </h5>
            <p className="text-[11px] font-serif text-[#475569] line-clamp-1 italic">
              Watching lightning dance across the western hill...
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#f0f4f8] p-3 rounded border border-[#e2e8f0]/80 space-y-0.5">
            <span className="text-[10px] font-sans font-medium text-[#64748b]">
              2018 • 8 years ago
            </span>
            <h5 className="text-xs font-serif font-bold text-[#162f4d]">
              Reflections on the Old Cedar Tree
            </h5>
            <p className="text-[11px] font-serif text-[#475569] line-clamp-1 italic">
              When thirty years of roots yield to a single sudd...
            </p>
          </div>
        </div>
      </div>

      {/* 5. ARCHIVES TABLE WIDGET */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#475569] uppercase font-sans">
            Archives
          </h4>
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-serif text-[#334155]">
          <Link href="/archive" className="flex items-center justify-between hover:underline">
            <span>2026</span>
            <span className="text-neutral-400 font-sans text-[11px]">(31)</span>
          </Link>
          <Link href="/archive" className="flex items-center justify-between hover:underline">
            <span>2025</span>
            <span className="text-neutral-400 font-sans text-[11px]">(64)</span>
          </Link>
          <Link href="/archive" className="flex items-center justify-between hover:underline">
            <span>2024</span>
            <span className="text-neutral-400 font-sans text-[11px]">(58)</span>
          </Link>
          <Link href="/archive" className="flex items-center justify-between hover:underline">
            <span>2023</span>
            <span className="text-neutral-400 font-sans text-[11px]">(72)</span>
          </Link>
          <Link href="/archive" className="flex items-center justify-between hover:underline">
            <span>2022</span>
            <span className="text-neutral-400 font-sans text-[11px]">(69)</span>
          </Link>
          <Link href="/archive" className="flex items-center justify-between hover:underline">
            <span>2021</span>
            <span className="text-neutral-400 font-sans text-[11px]">(54)</span>
          </Link>
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

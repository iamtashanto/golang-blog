"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types";
import { api } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Search, MessageSquare, Eye, ThumbsUp } from "lucide-react";

export default function ArchivePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchArchive();
  }, []);

  const fetchArchive = async () => {
    try {
      const res = await api.get("/archive");
      setPosts(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  // Group posts by Year
  const groupedByYear: Record<string, Post[]> = {};
  filteredPosts.forEach((post) => {
    const year = new Date(post.CreatedAt).getFullYear().toString();
    if (!groupedByYear[year]) {
      groupedByYear[year] = [];
    }
    groupedByYear[year].push(post);
  });

  const years = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 font-serif">
      {/* Header */}
      <div className="border-b border-neutral-300 pb-4 space-y-2">
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-black font-serif"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">
          Chronological Archive
        </h1>
        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase font-sans">
          A complete index of articles arranged by year of publication
        </p>

        <div className="pt-3 max-w-sm">
          <input
            type="text"
            placeholder="Search within archive..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 placeholder:italic font-serif"
          />
        </div>
      </div>

      {/* Timeline List */}
      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-16 bg-neutral-200"></div>
          <div className="h-16 bg-neutral-200"></div>
        </div>
      ) : years.length === 0 ? (
        <div className="p-10 text-center border border-neutral-200 text-neutral-400 text-xs italic">
          No records currently in the archives.
        </div>
      ) : (
        <div className="space-y-12">
          {years.map((year) => (
            <section key={year} className="space-y-4">
              <div className="flex items-center space-x-3 border-b border-neutral-300 pb-2">
                <span className="text-2xl font-serif font-bold text-neutral-900">
                  {year}
                </span>
                <span className="text-xs font-sans text-neutral-400">
                  ({groupedByYear[year].length} essays)
                </span>
              </div>

              <div className="divide-y divide-neutral-200">
                {groupedByYear[year].map((post) => {
                  const date = new Date(post.CreatedAt);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <article
                      key={post.ID}
                      className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 hover:bg-[#fbfbf9] px-2 transition-colors"
                    >
                      <div className="flex items-baseline space-x-4">
                        <span className="text-xs font-sans text-neutral-400 w-16 shrink-0">
                          {formattedDate}
                        </span>
                        <Link
                          href={`/posts/${post.ID}`}
                          className="text-sm font-serif font-bold text-neutral-900 hover:underline"
                        >
                          {post.title}
                        </Link>
                      </div>

                      <div className="flex items-center space-x-3 text-xs font-sans text-neutral-400 self-end sm:self-auto">
                        <span className="text-[10px] uppercase tracking-wider bg-neutral-100 text-neutral-600 px-2 py-0.5">
                          {post.category || "General"}
                        </span>
                        <span>💬 {post.comments?.length || 0}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

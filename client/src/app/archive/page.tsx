"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types";
import { api } from "@/lib/api";
import Link from "next/link";
import { Archive as ArchiveIcon, Calendar, Clock, Eye, ThumbsUp, MessageSquare, ArrowUpRight, Search } from "lucide-react";

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
      p.category.toLowerCase().includes(search.toLowerCase())
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
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs text-indigo-300">
          <ArchiveIcon className="w-3.5 h-3.5" />
          <span>Timeline Archive</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Chronological Blog Archive
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
          A complete timeline of all articles published on this platform, organized by year and month.
        </p>

        <div className="pt-2 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search archive..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* Timeline List */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white p-6 rounded-2xl border border-gray-100 h-24 animate-pulse"></div>
          ))}
        </div>
      ) : years.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-400 text-sm">
          No articles in the archive yet.
        </div>
      ) : (
        <div className="space-y-12">
          {years.map((year) => (
            <section key={year} className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-black text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-xl">
                  {year}
                </span>
                <div className="h-px bg-gray-200 flex-grow"></div>
                <span className="text-xs text-gray-400 font-medium">
                  {groupedByYear[year].length} articles
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 divide-y divide-gray-50 shadow-sm overflow-hidden">
                {groupedByYear[year].map((post) => {
                  const date = new Date(post.CreatedAt);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <Link
                      key={post.ID}
                      href={`/posts/${post.ID}`}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50/80 transition-colors gap-3"
                    >
                      <div className="flex items-start sm:items-center space-x-4">
                        <span className="text-xs font-semibold text-gray-400 w-14 shrink-0">
                          {formattedDate}
                        </span>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {post.title}
                          </h4>
                          <span className="inline-block text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {post.category || "General"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-400 self-end sm:self-center">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span>{post.views || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-3.5 h-3.5 text-rose-400" />
                          <span>{post.likes || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{post.comments?.length || 0}</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </Link>
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post, CategoryCount, SiteSetting } from "@/types";
import { api } from "@/lib/api";
import FeaturedArticle from "@/components/FeaturedArticle";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [settings, setSettings] = useState<SiteSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const [postsRes, catRes, setRes] = await Promise.all([
        api.get("/posts?sort=latest"),
        api.get("/categories"),
        api.get("/settings"),
      ]);

      setPosts(postsRes.data.data || []);
      setCategories(catRes.data.data || []);
      setSettings(setRes.data.data || null);
    } catch (err) {
      console.error("Failed to load blog data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  const featuredPost = !searchQuery.trim() && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const listPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(listPosts.length / postsPerPage));
  const indexOfLastPost = activePage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = listPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start font-serif">
      {/* LEFT COLUMN: ARTICLES FEED (8 COLS) */}
      <div className="lg:col-span-8 space-y-8">
        {/* 1. TOP FEATURED ARTICLE */}
        {featuredPost && <FeaturedArticle post={featuredPost} />}

        {/* 2. LATEST POSTS HEADER */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-neutral-300 pb-2">
            <h2 className="text-2xl font-serif font-bold text-[#162f4d] tracking-tight">
              {searchQuery ? `Search Results (${filteredPosts.length})` : "Latest Posts"}
            </h2>
            <Link
              href="/archive"
              className="text-[11px] font-bold tracking-[0.18em] text-[#64748b] hover:text-[#162f4d] uppercase font-sans transition-colors"
            >
              Chronological Archive
            </Link>
          </div>

          {loading ? (
            <div className="space-y-6 animate-pulse py-4">
              <div className="h-24 bg-slate-100"></div>
              <div className="h-24 bg-slate-100"></div>
              <div className="h-24 bg-slate-100"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center border border-neutral-200 bg-[#fbfbf9] space-y-3">
              <h3 className="font-serif text-xl font-bold text-neutral-800">
                No essays found
              </h3>
              <p className="text-xs text-neutral-500 font-serif">
                We couldn&apos;t find any chronicles matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-900 underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {currentPosts.map((post) => (
                <PostCard key={post.ID} post={post} />
              ))}
            </div>
          )}

          {/* 4. PAGINATION FOOTER */}
          {totalPages > 1 && (
            <div className="pt-8 border-t border-neutral-200 flex items-center justify-between text-xs font-serif text-[#334155]">
              <button
                onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                disabled={activePage === 1}
                className="hover:underline flex items-center space-x-1 disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>← Older Entries</span>
              </button>

              <div className="flex items-center space-x-2 font-serif text-xs">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setActivePage(num)}
                    className={`px-2 py-0.5 ${activePage === num ? "border-b-2 border-black font-bold text-black" : "hover:underline text-[#64748b]"}`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActivePage((p) => Math.min(totalPages, p + 1))}
                disabled={activePage === totalPages}
                className="hover:underline flex items-center space-x-1 disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>Newer Entries →</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: DYNAMIC SIDEBAR (4 COLS) */}
      <div className="lg:col-span-4">
        <Sidebar
          categories={categories}
          posts={posts}
          settings={settings}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </div>
  );
}

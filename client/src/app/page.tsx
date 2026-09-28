"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post, CategoryCount } from "@/types";
import { api } from "@/lib/api";
import FeaturedArticle from "@/components/FeaturedArticle";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const [postsRes, catRes] = await Promise.all([
        api.get("/posts?sort=latest"),
        api.get("/categories"),
      ]);
      setPosts(postsRes.data.data || []);
      setCategories(catRes.data.data || []);
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

  // Featured post is first post if no search is active
  const featuredPost = !searchQuery.trim() && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const standardPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(standardPosts.length / postsPerPage));
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = standardPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="max-w-6xl mx-auto">
      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
        {/* Left Column: Editorial Articles Feed (7.5/12 cols) */}
        <main className="lg:col-span-8 space-y-8">
          {loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="h-64 bg-neutral-200/60 rounded-none"></div>
              <div className="space-y-4">
                <div className="h-24 bg-neutral-200/40"></div>
                <div className="h-24 bg-neutral-200/40"></div>
                <div className="h-24 bg-neutral-200/40"></div>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center border border-neutral-200 bg-[#fbfbf9] space-y-3">
              <h3 className="font-serif text-xl font-bold text-neutral-800">
                No essays found
              </h3>
              <p className="text-xs text-neutral-500 font-serif">
                We couldn&apos;t find any chronicles matching &ldquo;{searchQuery}&rdquo;. Try another term.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-900 underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Top Featured Article Block */}
              {featuredPost && <FeaturedArticle post={featuredPost} />}

              {/* Latest Posts Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
                    {searchQuery ? `Search Results (${filteredPosts.length})` : "Latest Posts"}
                  </h2>
                  <Link
                    href="/archive"
                    className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-neutral-500 hover:text-black uppercase font-sans transition-colors"
                  >
                    Chronological Archive
                  </Link>
                </div>

                {/* List of articles */}
                <div className="divide-y divide-neutral-200/80">
                  {currentPosts.map((post) => (
                    <PostCard key={post.ID} post={post} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-8 border-t border-neutral-200 flex items-center justify-between text-xs font-serif text-neutral-600">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center space-x-1 hover:text-black disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Older Entries</span>
                    </button>

                    <div className="flex items-center space-x-2 font-sans text-xs">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          onClick={() => setCurrentPage(num)}
                          className={`w-7 h-7 flex items-center justify-center transition-colors ${
                            currentPage === num
                              ? "bg-neutral-900 text-white font-bold"
                              : "hover:bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center space-x-1 hover:text-black disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <span>Newer Entries</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Right Column: Editorial Sidebar (4.5/12 cols) */}
        <div className="lg:col-span-4">
          <Sidebar
            categories={categories}
            popularPosts={posts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
    </div>
  );
}

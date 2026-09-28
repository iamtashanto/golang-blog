"use client";

import { useEffect, useState } from "react";
import { Post, CategoryCount, BlogStats } from "@/types";
import { api } from "@/lib/api";
import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import { 
  Flame, 
  Clock, 
  ThumbsUp, 
  Layers, 
  TrendingUp, 
  Activity, 
  SearchX, 
  Sparkles,
  ArrowRight,
  Eye,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "likes">("latest");

  useEffect(() => {
    fetchData();
  }, [selectedCategory, sortBy]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort: sortBy };
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (search.trim()) params.search = search;

      const [postsRes, catRes, statsRes] = await Promise.all([
        api.get("/posts", { params }),
        api.get("/categories"),
        api.get("/stats"),
      ]);

      setPosts(postsRes.data.data || []);
      setCategories(catRes.data.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      console.error("Failed to load blog data:", err);
    } finally {
      setLoading(false);
    }
  };

  const trendingPosts = [...posts]
    .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
    .slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <Hero
        search={search}
        setSearch={setSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        totalPosts={stats?.total_posts || posts.length}
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Post Feed */}
        <div className="lg:col-span-8 space-y-8">
          {/* Controls Bar: Filter & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-gray-900">
                {selectedCategory === "All" ? "All Articles" : selectedCategory}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                {posts.length} {posts.length === 1 ? "article" : "articles"}
              </span>
            </div>

            {/* Sort Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-gray-600">
              <button
                onClick={() => setSortBy("latest")}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
                  sortBy === "latest" ? "bg-white text-gray-900 font-semibold shadow-sm" : "hover:text-gray-900"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Latest</span>
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
                  sortBy === "popular" ? "bg-white text-gray-900 font-semibold shadow-sm" : "hover:text-gray-900"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Most Viewed</span>
              </button>
              <button
                onClick={() => setSortBy("likes")}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
                  sortBy === "likes" ? "bg-white text-gray-900 font-semibold shadow-sm" : "hover:text-gray-900"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5 text-rose-500" />
                <span>Top Liked</span>
              </button>
            </div>
          </div>

          {/* Posts Grid / Loading State */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/4 pt-4"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                <SearchX className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No articles found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                We couldn&apos;t find any posts matching your criteria. Try adjusting your search query or selecting a different category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* If first post exists, render it as featured when no search is active */}
              {!search && selectedCategory === "All" && posts.length > 0 && (
                <PostCard post={posts[0]} featured={true} />
              )}

              {/* Remaining Posts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(!search && selectedCategory === "All" ? posts.slice(1) : posts).map((post) => (
                  <PostCard key={post.ID} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Quick Platform Metrics */}
          {stats && (
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-950/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold tracking-wide">Platform Vitality</h4>
                </div>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-semibold px-2 py-0.5 rounded-full uppercase">
                  Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl">
                  <span className="text-[11px] text-gray-300">Total Views</span>
                  <div className="text-xl font-extrabold flex items-center space-x-1.5 mt-1">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span>{stats.total_views}</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl">
                  <span className="text-[11px] text-gray-300">Total Likes</span>
                  <div className="text-xl font-extrabold flex items-center space-x-1.5 mt-1">
                    <ThumbsUp className="w-4 h-4 text-rose-400" />
                    <span>{stats.total_likes}</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl">
                  <span className="text-[11px] text-gray-300">Published Posts</span>
                  <div className="text-xl font-extrabold flex items-center space-x-1.5 mt-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{stats.published_posts}</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl">
                  <span className="text-[11px] text-gray-300">Comments</span>
                  <div className="text-xl font-extrabold flex items-center space-x-1.5 mt-1">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>{stats.total_comments}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories Widget */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Categories</span>
              </h4>
              <Link href="/categories" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                    selectedCategory === cat.category
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{cat.category}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Trending Articles Widget */}
          {trendingPosts.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                <span>Popular Trending</span>
              </h4>

              <div className="space-y-3.5">
                {trendingPosts.map((post, idx) => (
                  <Link
                    key={post.ID}
                    href={`/posts/${post.ID}`}
                    className="flex items-start space-x-3 group block"
                  >
                    <span className="text-lg font-black text-gray-300 group-hover:text-indigo-600 transition-colors w-4">
                      0{idx + 1}
                    </span>
                    <div className="flex-1 space-y-1">
                      <h5 className="text-xs font-semibold text-gray-800 group-hover:text-indigo-600 line-clamp-2 transition-colors">
                        {post.title}
                      </h5>
                      <div className="flex items-center space-x-3 text-[10px] text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3 text-blue-400" />
                          <span>{post.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-3 h-3 text-rose-400" />
                          <span>{post.likes}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Box */}
          <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-6 border border-indigo-100/50 space-y-3">
            <h4 className="text-sm font-bold text-gray-900">Weekly Tech Newsletter</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Get notified when new articles about Golang, system design, and frontend optimization are published.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-sm"
              >
                Join Readers
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

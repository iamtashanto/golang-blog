"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Post, Comment, BlogStats } from "@/types";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  MessageSquare,
  BarChart3,
  LogOut,
  Plus,
  Eye,
  ThumbsUp,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Search,
  Layers,
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  Save,
  X
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();

  // State management
  const [activeTab, setActiveTab] = useState<"posts" | "editor" | "comments" | "analytics">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filters for Posts table
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");

  // Form State for Post Creation / Editing
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Go");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  // Notification Toast State
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/login");
      return;
    }

    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [postsRes, statsRes, commentsRes] = await Promise.all([
        api.get("/posts?all=true"),
        api.get("/admin/stats"),
        api.get("/admin/comments").catch(() => ({ data: { data: [] } })),
      ]);

      setPosts(postsRes.data.data || []);
      setStats(statsRes.data || null);
      setComments(commentsRes.data?.data || []);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/login");
      } else {
        console.error("Failed to load admin data:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  const resetForm = () => {
    setEditingPostId(null);
    setTitle("");
    setCategory("Go");
    setSummary("");
    setImageUrl("");
    setContent("");
    setPublished(true);
  };

  const handleStartEdit = (post: Post) => {
    setEditingPostId(post.ID);
    setTitle(post.title);
    setCategory(post.category || "General");
    setSummary(post.summary || "");
    setImageUrl(post.image_url || "");
    setContent(post.content);
    setPublished(post.published);
    setActiveTab("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      const payload = {
        title,
        category,
        summary,
        image_url: imageUrl,
        content,
        published,
      };

      if (editingPostId) {
        await api.put(`/posts/${editingPostId}`, payload);
        showToast("success", "Article updated successfully!");
      } else {
        await api.post("/posts", payload);
        showToast("success", "New article published successfully!");
      }

      resetForm();
      setActiveTab("posts");
      loadDashboardData();
    } catch (err: any) {
      showToast("error", err.response?.data?.error || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;

    try {
      await api.delete(`/posts/${id}`);
      showToast("success", "Article deleted successfully");
      loadDashboardData();
    } catch (err: any) {
      showToast("error", err.response?.data?.error || "Failed to delete article");
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await api.delete(`/comments/${id}`);
      showToast("success", "Comment removed");
      setComments(comments.filter((c) => c.ID !== id));
      loadDashboardData();
    } catch (err: any) {
      showToast("error", err.response?.data?.error || "Failed to delete comment");
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedFilterCategory === "All" || p.category === selectedFilterCategory;
    return matchesSearch && matchesCat;
  });

  const categoriesList = Array.from(new Set(posts.map((p) => p.category || "General")));

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold ${
              toast.type === "success"
                ? "bg-emerald-900 text-white border-emerald-700"
                : "bg-rose-900 text-white border-rose-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-xs text-gray-400">GORM Database Connected</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Blog Management Studio</h1>
          <p className="text-xs text-gray-300">
            Publish articles, track engagement metrics, manage discussions, and configure categories.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              resetForm();
              setActiveTab("editor");
            }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 rounded-xl text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Key Metric Overview Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">Total Articles</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{stats.total_posts}</div>
            <div className="flex items-center space-x-2 text-[10px] text-gray-400">
              <span className="text-emerald-600 font-semibold">{stats.published_posts} published</span>
              <span>•</span>
              <span>{stats.draft_posts} drafts</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">Total Views</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{stats.total_views}</div>
            <p className="text-[10px] text-blue-600 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Real-time tracking</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">Reader Likes</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <ThumbsUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{stats.total_likes}</div>
            <p className="text-[10px] text-rose-600 font-semibold">Community appreciation</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">Comments</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{stats.total_comments}</div>
            <p className="text-[10px] text-emerald-600 font-semibold">Active discussions</p>
          </div>
        </div>
      )}

      {/* Navigation Tab Bar */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "posts"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Articles ({posts.length})</span>
        </button>

        <button
          onClick={() => {
            if (activeTab !== "editor") resetForm();
            setActiveTab("editor");
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "editor"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <PenSquare className="w-4 h-4" />
          <span>{editingPostId ? "Edit Article" : "Write Article"}</span>
        </button>

        <button
          onClick={() => setActiveTab("comments")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "comments"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comments ({comments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "analytics"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </button>
      </div>

      {/* TAB 1: POSTS TABLE */}
      {activeTab === "posts" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Category:</span>
              <select
                value={selectedFilterCategory}
                onChange={(e) => setSelectedFilterCategory(e.target.value)}
                className="text-xs bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 outline-none"
              >
                <option value="All">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Title & Excerpt</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Views</th>
                  <th className="py-3 px-4 text-center">Likes</th>
                  <th className="py-3 px-4 text-center">Comments</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      No articles found. Click &quot;Write Article&quot; to publish your first post!
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.ID} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <Link
                          href={`/posts/${post.ID}`}
                          target="_blank"
                          className="font-bold text-gray-900 hover:text-indigo-600 line-clamp-1 block"
                        >
                          {post.title}
                        </Link>
                        <p className="text-[11px] text-gray-400 line-clamp-1">
                          {post.summary || post.content}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-[10px]">
                          {post.category || "General"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            post.published
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-gray-600">
                        {post.views || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-gray-600">
                        {post.likes || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-gray-600">
                        {post.comments?.length || 0}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link
                            href={`/posts/${post.ID}`}
                            target="_blank"
                            title="View Live"
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleStartEdit(post)}
                            title="Edit Article"
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.ID)}
                            title="Delete Article"
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: POST WRITER / EDITOR */}
      {activeTab === "editor" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {editingPostId ? "Edit Article" : "Create New Article"}
              </h3>
              <p className="text-xs text-gray-400">
                Craft markdown/rich articles with cover images and SEO summaries.
              </p>
            </div>
            {editingPostId && (
              <button
                onClick={resetForm}
                className="text-xs text-gray-500 hover:text-gray-900 flex items-center space-x-1 bg-gray-100 px-3 py-1.5 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Edit</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSavePost} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Building High-Throughput REST APIs with Go Gin & GORM"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category / Tag</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Go">Go / Golang</option>
                  <option value="Backend">Backend Architecture</option>
                  <option value="Database">Database & PostgreSQL</option>
                  <option value="Frontend">Frontend (Next.js/React)</option>
                  <option value="DevOps">DevOps & Cloud</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cover Image URL (Optional)</label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                />
              </div>
              {imageUrl && (
                <div className="mt-3 w-40 h-24 rounded-xl overflow-hidden bg-gray-100 border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Excerpt / Summary */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Short Excerpt / Summary</label>
              <textarea
                rows={2}
                placeholder="A brief 1-2 sentence hook for search previews..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              ></textarea>
            </div>

            {/* Content Body */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Article Body Content *</label>
              <textarea
                rows={12}
                placeholder="Write your in-depth article here. Supports paragraphs, code snippets, and markdown formatting..."
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-xs font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              ></textarea>
            </div>

            {/* Published Toggle & Submit */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span>Publish immediately (Make public)</span>
              </label>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : editingPostId ? "Update Article" : "Publish Article"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: COMMENTS MODERATION */}
      {activeTab === "comments" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Reader Discussions & Comments</h3>
              <p className="text-xs text-gray-400">Moderate community comments and remove spam.</p>
            </div>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
              {comments.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400">
                No comments submitted yet.
              </div>
            ) : (
              comments.map((c) => (
                <div
                  key={c.ID}
                  className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-200 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-900">{c.author}</span>
                      {c.email && <span className="text-[10px] text-gray-400">({c.email})</span>}
                      <span className="text-[10px] text-gray-400">
                        • {new Date(c.CreatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 whitespace-pre-wrap">{c.content}</p>
                    <span className="text-[10px] text-indigo-600 font-medium">Post ID: #{c.post_id}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(c.ID)}
                    className="self-end sm:self-center p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Viewed Posts */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <span>Top Viewed Articles</span>
            </h4>
            <div className="space-y-3">
              {[...posts]
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
                .map((p, idx) => (
                  <div key={p.ID} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <span className="font-bold text-gray-400">0{idx + 1}</span>
                      <span className="font-semibold text-gray-800 truncate">{p.title}</span>
                    </div>
                    <span className="font-bold text-blue-600 shrink-0 ml-2">{p.views} views</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Liked Posts */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
              <ThumbsUp className="w-4 h-4 text-rose-500" />
              <span>Most Liked Articles</span>
            </h4>
            <div className="space-y-3">
              {[...posts]
                .sort((a, b) => b.likes - a.likes)
                .slice(0, 5)
                .map((p, idx) => (
                  <div key={p.ID} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <span className="font-bold text-gray-400">0{idx + 1}</span>
                      <span className="font-semibold text-gray-800 truncate">{p.title}</span>
                    </div>
                    <span className="font-bold text-rose-600 shrink-0 ml-2">{p.likes} likes</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

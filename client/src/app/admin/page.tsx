"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Post, Comment, BlogStats } from "@/types";
import { api } from "@/lib/api";
import {
  FileText,
  PenSquare,
  MessageSquare,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Layers,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"posts" | "editor" | "comments" | "analytics">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Go");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

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
        showToast("success", "Essay updated successfully.");
      } else {
        await api.post("/posts", payload);
        showToast("success", "Essay published to the chronicle.");
      }

      resetForm();
      setActiveTab("posts");
      loadDashboardData();
    } catch (err: any) {
      showToast("error", err.response?.data?.error || "Failed to save essay");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you certain you wish to remove this article from the chronicle?")) return;

    try {
      await api.delete(`/posts/${id}`);
      showToast("success", "Article removed.");
      loadDashboardData();
    } catch (err: any) {
      showToast("error", err.response?.data?.error || "Failed to delete article");
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm("Delete this response?")) return;

    try {
      await api.delete(`/comments/${id}`);
      showToast("success", "Comment removed.");
      setComments(comments.filter((c) => c.ID !== id));
      loadDashboardData();
    } catch (err: any) {
      showToast("error", "Failed to delete comment");
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedFilterCategory === "All" || p.category === selectedFilterCategory;
    return matchesSearch && matchesCat;
  });

  const categoriesList = Array.from(new Set(posts.map((p) => p.category || "General")));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-serif">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-4 py-3 text-xs font-sans font-semibold border shadow-lg flex items-center space-x-2 ${
              toast.type === "success"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-rose-900 text-white border-rose-900"
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

      {/* Header */}
      <div className="border-b border-neutral-300 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-black font-serif"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Chronicle</span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-neutral-900 mt-2">
            Editorial Studio & Archive Desk
          </h1>
          <p className="text-xs font-sans tracking-[0.2em] text-neutral-400 uppercase">
            Publishing, Moderation & Ledger Controls
          </p>
        </div>

        <div className="flex items-center space-x-2 font-sans text-xs">
          <button
            onClick={() => {
              resetForm();
              setActiveTab("editor");
            }}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write Essay</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-700 transition"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-serif">
          <div className="p-4 bg-[#fbfbf9] border border-neutral-200 space-y-1">
            <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-400">Total Essays</span>
            <div className="text-2xl font-bold text-neutral-900">{stats.total_posts}</div>
            <p className="text-[11px] text-neutral-500">{stats.published_posts} published • {stats.draft_posts} drafts</p>
          </div>
          <div className="p-4 bg-[#fbfbf9] border border-neutral-200 space-y-1">
            <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-400">Total Readers</span>
            <div className="text-2xl font-bold text-neutral-900">{stats.total_views}</div>
            <p className="text-[11px] text-neutral-500">Cumulative page views</p>
          </div>
          <div className="p-4 bg-[#fbfbf9] border border-neutral-200 space-y-1">
            <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-400">Appreciation</span>
            <div className="text-2xl font-bold text-neutral-900">{stats.total_likes}</div>
            <p className="text-[11px] text-neutral-500">Likes recorded</p>
          </div>
          <div className="p-4 bg-[#fbfbf9] border border-neutral-200 space-y-1">
            <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-400">Responses</span>
            <div className="text-2xl font-bold text-neutral-900">{stats.total_comments}</div>
            <p className="text-[11px] text-neutral-500">Reader comments</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-neutral-300 font-sans text-xs font-semibold">
        <button
          onClick={() => setActiveTab("posts")}
          className={`py-2 px-4 transition border-b-2 ${
            activeTab === "posts"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-400 hover:text-neutral-900"
          }`}
        >
          All Essays ({posts.length})
        </button>
        <button
          onClick={() => {
            if (activeTab !== "editor") resetForm();
            setActiveTab("editor");
          }}
          className={`py-2 px-4 transition border-b-2 ${
            activeTab === "editor"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-400 hover:text-neutral-900"
          }`}
        >
          {editingPostId ? "Edit Essay" : "Draft New Essay"}
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`py-2 px-4 transition border-b-2 ${
            activeTab === "comments"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-400 hover:text-neutral-900"
          }`}
        >
          Reader Responses ({comments.length})
        </button>
      </div>

      {/* TAB 1: ALL POSTS LEDGER */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-xs">
            <input
              type="text"
              placeholder="Filter essays by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-3 py-1.5 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
            />

            <select
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-white border border-neutral-300"
            >
              <option value="All">All Topics</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="border border-neutral-300 overflow-x-auto bg-white">
            <table className="w-full text-left text-xs font-serif">
              <thead>
                <tr className="border-b border-neutral-200 bg-[#fbfbf9] text-neutral-500 font-sans uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4">Topic</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-center">Views</th>
                  <th className="py-2.5 px-4 text-center">Likes</th>
                  <th className="py-2.5 px-4 text-center">Comments</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-neutral-400 italic">
                      No essays recorded in ledger.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.ID} className="hover:bg-[#fdfdfc] transition">
                      <td className="py-3 px-4 font-bold text-neutral-900 max-w-sm">
                        <Link href={`/posts/${post.ID}`} target="_blank" className="hover:underline">
                          {post.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-[11px] font-sans">{post.category || "General"}</td>
                      <td className="py-3 px-4 text-[10px] font-sans uppercase font-bold">
                        {post.published ? (
                          <span className="text-emerald-700">Published</span>
                        ) : (
                          <span className="text-neutral-400">Draft</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-sans">{post.views || 0}</td>
                      <td className="py-3 px-4 text-center font-sans">{post.likes || 0}</td>
                      <td className="py-3 px-4 text-center font-sans">{post.comments?.length || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2 font-sans">
                        <button
                          onClick={() => handleStartEdit(post)}
                          className="text-neutral-600 hover:text-black"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.ID)}
                          className="text-neutral-400 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WRITER DESK */}
      {activeTab === "editor" && (
        <form onSubmit={handleSavePost} className="border border-neutral-300 bg-white p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-neutral-900">
              {editingPostId ? "Edit Chronicle" : "Draft New Chronicle"}
            </h3>
            {editingPostId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-neutral-500 hover:text-black flex items-center space-x-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
                Essay Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Sundays at the Round Oak Table"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 font-serif text-sm font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
                Category / Theme
              </label>
              <input
                type="text"
                placeholder="e.g. Architecture, Go, Culture"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="font-sans text-xs space-y-1">
            <label className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
              Cover Illustration / Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="font-sans text-xs space-y-1">
            <label className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
              Abstract / Short Excerpt
            </label>
            <textarea
              rows={2}
              placeholder="A brief opening hook for the ledger index..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 font-serif leading-relaxed"
            ></textarea>
          </div>

          <div className="font-sans text-xs space-y-1">
            <label className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
              Manuscript Content *
            </label>
            <textarea
              rows={12}
              placeholder="Write the full body of the chronicle..."
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 font-serif text-sm leading-relaxed"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 font-sans text-xs">
            <label className="flex items-center space-x-2 cursor-pointer text-neutral-700">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-neutral-900"
              />
              <span>Set as Published (Visible on Front Page)</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold uppercase tracking-wider transition disabled:opacity-50"
            >
              {saving ? "Saving..." : editingPostId ? "Update Chronicle" : "Publish to Chronicle"}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: COMMENTS */}
      {activeTab === "comments" && (
        <div className="border border-neutral-300 bg-white p-6 space-y-4">
          <div className="border-b border-neutral-200 pb-2 flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-neutral-900">
              Reader Submissions & Responses ({comments.length})
            </h3>
          </div>

          <div className="divide-y divide-neutral-200">
            {comments.length === 0 ? (
              <p className="text-neutral-400 text-xs italic py-6 text-center">
                No reader responses recorded.
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.ID} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-sans">
                      <span className="font-bold text-neutral-900">{c.author}</span>
                      {c.email && <span className="text-neutral-400">({c.email})</span>}
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-400">
                        {new Date(c.CreatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700 font-serif whitespace-pre-wrap">{c.content}</p>
                    <span className="text-[10px] text-neutral-400 font-sans">Essay ID #{c.post_id}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(c.ID)}
                    className="p-1 text-neutral-400 hover:text-rose-600 font-sans text-xs"
                    title="Delete response"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

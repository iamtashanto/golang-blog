"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Post, Comment, BlogStats } from "@/types";
import { api } from "@/lib/api";
import {
  FileText,
  PenSquare,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Users,
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface ContactMessage {
  ID: number;
  CreatedAt: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
}

interface Subscriber {
  ID: number;
  CreatedAt: string;
  email: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"posts" | "editor" | "comments" | "messages" | "subscribers">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Faith");
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
      const [postsRes, statsRes, commentsRes, msgsRes, subsRes] = await Promise.all([
        api.get("/posts?all=true"),
        api.get("/admin/stats"),
        api.get("/admin/comments").catch(() => ({ data: { data: [] } })),
        api.get("/admin/messages").catch(() => ({ data: { data: [] } })),
        api.get("/admin/subscribers").catch(() => ({ data: { data: [] } })),
      ]);

      setPosts(postsRes.data.data || []);
      setStats(statsRes.data || null);
      setComments(commentsRes.data?.data || []);
      setMessages(msgsRes.data?.data || []);
      setSubscribers(subsRes.data?.data || []);
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
    setCategory("Faith");
    setSummary("");
    setImageUrl("");
    setContent("");
    setPublished(true);
  };

  const handleStartEdit = (post: Post) => {
    setEditingPostId(post.ID);
    setTitle(post.title);
    setCategory(post.category || "Faith");
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
        showToast("success", "Essay updated successfully in the chronicle.");
      } else {
        await api.post("/posts", payload);
        showToast("success", "New essay published to the chronicle.");
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
    if (!confirm("Are you certain you wish to delete this article?")) return;

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

  const categoriesList = Array.from(new Set(["Family", "Faith", "Culture", "History", "Commentary", "Humor", ...posts.map((p) => p.category || "Faith")]));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-serif">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-4 py-3 text-xs font-sans font-semibold border shadow-lg flex items-center space-x-2 ${
              toast.type === "success"
                ? "bg-[#162f4d] text-white border-[#162f4d]"
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
          <h1 className="text-3xl font-serif font-bold text-[#162f4d] mt-2">
            Editorial Studio & Desk
          </h1>
          <p className="text-xs font-sans tracking-[0.2em] text-[#64748b] uppercase">
            Publishing, Readers, Moderation & Ledger Controls
          </p>
        </div>

        <div className="flex items-center space-x-2 font-sans text-xs">
          <button
            onClick={() => {
              resetForm();
              setActiveTab("editor");
            }}
            className="px-4 py-2 bg-[#162f4d] hover:bg-[#0f233a] text-white font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition"
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
          <div className="p-4 bg-[#f0f4f8] border border-[#cbd5e1] space-y-1">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#64748b]">Total Essays</span>
            <div className="text-2xl font-bold text-[#162f4d]">{stats.total_posts}</div>
            <p className="text-[11px] text-[#475569]">{stats.published_posts} published • {stats.draft_posts} drafts</p>
          </div>
          <div className="p-4 bg-[#f0f4f8] border border-[#cbd5e1] space-y-1">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#64748b]">Total Readers</span>
            <div className="text-2xl font-bold text-[#162f4d]">{stats.total_views}</div>
            <p className="text-[11px] text-[#475569]">Cumulative views</p>
          </div>
          <div className="p-4 bg-[#f0f4f8] border border-[#cbd5e1] space-y-1">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#64748b]">Responses</span>
            <div className="text-2xl font-bold text-[#162f4d]">{comments.length}</div>
            <p className="text-[11px] text-[#475569]">Reader comments</p>
          </div>
          <div className="p-4 bg-[#f0f4f8] border border-[#cbd5e1] space-y-1">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#64748b]">Subscribers</span>
            <div className="text-2xl font-bold text-[#162f4d]">{subscribers.length}</div>
            <p className="text-[11px] text-[#475569]">Dispatch readers</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-neutral-300 font-sans text-xs font-semibold">
        <button
          onClick={() => setActiveTab("posts")}
          className={`py-2 px-4 transition border-b-2 ${
            activeTab === "posts"
              ? "border-[#162f4d] text-[#162f4d]"
              : "border-transparent text-[#64748b] hover:text-[#162f4d]"
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
              ? "border-[#162f4d] text-[#162f4d]"
              : "border-transparent text-[#64748b] hover:text-[#162f4d]"
          }`}
        >
          {editingPostId ? "Edit Essay" : "Draft New Essay"}
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`py-2 px-4 transition border-b-2 ${
            activeTab === "comments"
              ? "border-[#162f4d] text-[#162f4d]"
              : "border-transparent text-[#64748b] hover:text-[#162f4d]"
          }`}
        >
          Responses ({comments.length})
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`py-2 px-4 transition border-b-2 ${
            activeTab === "messages"
              ? "border-[#162f4d] text-[#162f4d]"
              : "border-transparent text-[#64748b] hover:text-[#162f4d]"
          }`}
        >
          Correspondence ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab("subscribers")}
          className={`py-2 px-4 transition border-b-2 ${
            activeTab === "subscribers"
              ? "border-[#162f4d] text-[#162f4d]"
              : "border-transparent text-[#64748b] hover:text-[#162f4d]"
          }`}
        >
          Subscribers ({subscribers.length})
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
              className="w-full sm:w-80 px-3 py-1.5 bg-white border border-[#cbd5e1] focus:outline-none focus:border-[#162f4d]"
            />

            <select
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#cbd5e1]"
            >
              <option value="All">All Topics</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="border border-[#cbd5e1] overflow-x-auto bg-white">
            <table className="w-full text-left text-xs font-serif">
              <thead>
                <tr className="border-b border-[#cbd5e1] bg-[#f0f4f8] text-[#475569] font-sans uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4">Topic</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-center">Views</th>
                  <th className="py-2.5 px-4 text-center">Likes</th>
                  <th className="py-2.5 px-4 text-center">Comments</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-[#94a3b8] italic">
                      No essays recorded in ledger.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.ID} className="hover:bg-[#fbfbf9] transition">
                      <td className="py-3 px-4 font-bold text-[#162f4d] max-w-sm">
                        <Link href={`/posts/${post.ID}`} target="_blank" className="hover:underline">
                          {post.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-[11px] font-sans">{post.category || "Faith"}</td>
                      <td className="py-3 px-4 text-[10px] font-sans uppercase font-bold">
                        {post.published ? (
                          <span className="text-emerald-700">Published</span>
                        ) : (
                          <span className="text-[#94a3b8]">Draft</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-sans">{post.views || 0}</td>
                      <td className="py-3 px-4 text-center font-sans">{post.likes || 0}</td>
                      <td className="py-3 px-4 text-center font-sans">{post.comments?.length || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2 font-sans">
                        <button
                          onClick={() => handleStartEdit(post)}
                          className="text-[#475569] hover:text-[#162f4d]"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.ID)}
                          className="text-[#94a3b8] hover:text-rose-600"
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
        <form onSubmit={handleSavePost} className="border border-[#cbd5e1] bg-white p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#cbd5e1] pb-3 flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-[#162f4d]">
              {editingPostId ? "Edit Chronicle Essay" : "Draft New Chronicle Essay"}
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
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] focus:outline-none focus:border-[#162f4d] font-serif text-sm font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
                Category / Topic
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] focus:outline-none focus:border-[#162f4d]"
              >
                <option value="Family">Family</option>
                <option value="Faith">Faith</option>
                <option value="Culture">Culture</option>
                <option value="History">History</option>
                <option value="Commentary">Commentary</option>
                <option value="Humor">Humor</option>
              </select>
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
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] focus:outline-none focus:border-[#162f4d]"
            />
          </div>

          <div className="font-sans text-xs space-y-1">
            <label className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
              Abstract / Opening Excerpt
            </label>
            <textarea
              rows={2}
              placeholder="A brief opening hook for the front page..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] focus:outline-none focus:border-[#162f4d] font-serif leading-relaxed"
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
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] focus:outline-none focus:border-[#162f4d] font-serif text-sm leading-relaxed"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#cbd5e1] font-sans text-xs">
            <label className="flex items-center space-x-2 cursor-pointer text-neutral-700">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-[#162f4d]"
              />
              <span>Set as Published (Visible on Front Page)</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#162f4d] hover:bg-[#0f233a] text-white font-semibold uppercase tracking-wider transition disabled:opacity-50"
            >
              {saving ? "Saving..." : editingPostId ? "Update Essay" : "Publish to Chronicle"}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: COMMENTS */}
      {activeTab === "comments" && (
        <div className="border border-[#cbd5e1] bg-white p-6 space-y-4">
          <div className="border-b border-[#cbd5e1] pb-2 flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-[#162f4d]">
              Reader Responses ({comments.length})
            </h3>
          </div>

          <div className="divide-y divide-[#e2e8f0]">
            {comments.length === 0 ? (
              <p className="text-[#94a3b8] text-xs italic py-6 text-center">
                No reader responses recorded.
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.ID} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-sans">
                      <span className="font-bold text-[#162f4d]">{c.author}</span>
                      {c.email && <span className="text-[#64748b]">({c.email})</span>}
                      <span className="text-neutral-300">•</span>
                      <span className="text-[#64748b]">
                        {new Date(c.CreatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#334155] font-serif whitespace-pre-wrap">{c.content}</p>
                    <span className="text-[10px] text-[#64748b] font-sans">Post ID #{c.post_id}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(c.ID)}
                    className="p-1 text-[#94a3b8] hover:text-rose-600 font-sans text-xs"
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

      {/* TAB 4: CONTACT MESSAGES */}
      {activeTab === "messages" && (
        <div className="border border-[#cbd5e1] bg-white p-6 space-y-4">
          <div className="border-b border-[#cbd5e1] pb-2 flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-[#162f4d]">
              Editorial Correspondence & Letters ({messages.length})
            </h3>
          </div>

          <div className="divide-y divide-[#e2e8f0]">
            {messages.length === 0 ? (
              <p className="text-[#94a3b8] text-xs italic py-6 text-center">
                No letters received yet from the contact desk.
              </p>
            ) : (
              messages.map((m) => (
                <div key={m.ID} className="py-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#162f4d]">{m.name}</span>
                      <span className="text-[#64748b]">&lt;{m.email}&gt;</span>
                    </div>
                    <span className="text-[11px] text-[#94a3b8]">
                      {new Date(m.CreatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {m.subject && (
                    <div className="text-xs font-bold text-neutral-800 font-serif">
                      Subject: {m.subject}
                    </div>
                  )}
                  <p className="text-xs text-[#334155] font-serif whitespace-pre-wrap bg-[#f8fafc] p-3 border border-[#e2e8f0]">
                    {m.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SUBSCRIBERS */}
      {activeTab === "subscribers" && (
        <div className="border border-[#cbd5e1] bg-white p-6 space-y-4">
          <div className="border-b border-[#cbd5e1] pb-2 flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-[#162f4d]">
              Dispatch Subscribers ({subscribers.length})
            </h3>
          </div>

          <div className="divide-y divide-[#e2e8f0]">
            {subscribers.length === 0 ? (
              <p className="text-[#94a3b8] text-xs italic py-6 text-center">
                No subscribers registered yet.
              </p>
            ) : (
              subscribers.map((s) => (
                <div key={s.ID} className="py-3 flex items-center justify-between text-xs font-sans">
                  <span className="font-medium text-[#162f4d]">{s.email}</span>
                  <span className="text-[#64748b] text-[11px]">
                    Subscribed on {new Date(s.CreatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

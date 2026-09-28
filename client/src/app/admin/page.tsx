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
  Mail,
  Users,
  Eye,
  ThumbsUp,
  Trash2,
  Edit3,
  ExternalLink,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ArrowUpRight,
  TrendingUp,
  Image as ImageIcon,
  Save,
  X,
  Bold,
  Italic,
  Heading,
  Quote,
  Code,
  List,
  Copy,
  Check,
  Globe,
  Clock
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

export default function ProfessionalAdminDashboard() {
  const router = useRouter();

  // Navigation tabs
  const [currentTab, setCurrentTab] = useState<"overview" | "posts" | "editor" | "comments" | "messages" | "subscribers">("overview");

  // Data states
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [postSearch, setPostSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Editor states
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Faith");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  // Notifications Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedEmails, setCopiedEmails] = useState(false);

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

    loadDashboard();
  }, [router]);

  const loadDashboard = async () => {
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

  const resetEditor = () => {
    setEditingPostId(null);
    setTitle("");
    setCategory("Faith");
    setSummary("");
    setImageUrl("");
    setContent("");
    setPublished(true);
    setShowPreview(false);
  };

  const startEdit = (post: Post) => {
    setEditingPostId(post.ID);
    setTitle(post.title);
    setCategory(post.category || "Faith");
    setSummary(post.summary || "");
    setImageUrl(post.image_url || "");
    setContent(post.content);
    setPublished(post.published);
    setCurrentTab("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast("error", "Please provide both an essay title and content.");
      return;
    }

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

      resetEditor();
      setCurrentTab("posts");
      loadDashboard();
    } catch (err: any) {
      showToast("error", err.response?.data?.error || "Failed to save essay.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this essay?")) return;

    try {
      await api.delete(`/posts/${id}`);
      showToast("success", "Essay removed from ledger.");
      loadDashboard();
    } catch (err: any) {
      showToast("error", "Failed to delete essay.");
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm("Delete this response?")) return;

    try {
      await api.delete(`/comments/${id}`);
      showToast("success", "Response removed.");
      setComments(comments.filter((c) => c.ID !== id));
      loadDashboard();
    } catch (err: any) {
      showToast("error", "Failed to delete comment.");
    }
  };

  const handleCopySubscribers = () => {
    const emails = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 3000);
  };

  // Editor markdown helpers
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    setContent((prev) => prev + prefix + " " + suffix);
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(postSearch.toLowerCase());
    const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categoryList = Array.from(
    new Set(["Family", "Faith", "Culture", "History", "Commentary", "Humor", ...posts.map((p) => p.category || "Faith")])
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] -mx-4 sm:-mx-6 lg:-mx-8 -my-2 flex flex-col md:flex-row text-slate-800 font-sans antialiased">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`px-4 py-3 rounded-lg shadow-xl border text-xs font-semibold flex items-center space-x-2.5 ${
              toast.type === "success"
                ? "bg-[#0f172a] text-white border-slate-700"
                : "bg-rose-900 text-white border-rose-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between shrink-0 p-4 sm:p-6 border-r border-slate-800">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-serif font-bold text-lg shadow-md shadow-indigo-500/20">
                C
              </div>
              <div>
                <h2 className="text-sm font-serif font-bold text-white tracking-tight">
                  Castle Chronicle
                </h2>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-sans">
                  Editorial Studio
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Action: New Essay */}
          <button
            onClick={() => {
              resetEditor();
              setCurrentTab("editor");
            }}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center space-x-2 transition shadow-sm shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Essay</span>
          </button>

          {/* Main Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setCurrentTab("overview")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors ${
                currentTab === "overview"
                  ? "bg-slate-800 text-white font-semibold"
                  : "hover:bg-slate-800/60 hover:text-white text-slate-400"
              }`}
            >
              <div className="flex items-center space-x-3">
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab("posts")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors ${
                currentTab === "posts"
                  ? "bg-slate-800 text-white font-semibold"
                  : "hover:bg-slate-800/60 hover:text-white text-slate-400"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>All Articles</span>
              </div>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                {posts.length}
              </span>
            </button>

            <button
              onClick={() => {
                if (currentTab !== "editor") resetEditor();
                setCurrentTab("editor");
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors ${
                currentTab === "editor"
                  ? "bg-slate-800 text-white font-semibold"
                  : "hover:bg-slate-800/60 hover:text-white text-slate-400"
              }`}
            >
              <div className="flex items-center space-x-3">
                <PenSquare className="w-4 h-4 text-amber-400" />
                <span>{editingPostId ? "Edit Article" : "Write Article"}</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab("comments")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors ${
                currentTab === "comments"
                  ? "bg-slate-800 text-white font-semibold"
                  : "hover:bg-slate-800/60 hover:text-white text-slate-400"
              }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Reader Responses</span>
              </div>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                {comments.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab("messages")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors ${
                currentTab === "messages"
                  ? "bg-slate-800 text-white font-semibold"
                  : "hover:bg-slate-800/60 hover:text-white text-slate-400"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-rose-400" />
                <span>Correspondence</span>
              </div>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                {messages.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab("subscribers")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors ${
                currentTab === "subscribers"
                  ? "bg-slate-800 text-white font-semibold"
                  : "hover:bg-slate-800/60 hover:text-white text-slate-400"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-violet-400" />
                <span>Subscribers</span>
              </div>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                {subscribers.length}
              </span>
            </button>
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white uppercase">
                JC
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">James Castle</span>
                <span className="text-[10px] text-emerald-400 font-medium">Administrator</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full py-1.5 px-3 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-md text-[11px] flex items-center justify-center space-x-1.5 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Site</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE AREA */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {currentTab === "overview" && "Executive Dashboard"}
              {currentTab === "posts" && "Article Ledger & Management"}
              {currentTab === "editor" && (editingPostId ? "Revise Chronicle Essay" : "Draft New Chronicle Essay")}
              {currentTab === "comments" && "Reader Discussions & Responses"}
              {currentTab === "messages" && "Editorial Letters & Inquiries"}
              {currentTab === "subscribers" && "Dispatch Subscriber Roster"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              The Castle Chronicle content management engine & PostgreSQL database.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>PostgreSQL Live</span>
            </span>
          </div>
        </div>

        {/* TAB 1: EXECUTIVE DASHBOARD OVERVIEW */}
        {currentTab === "overview" && (
          <div className="space-y-8">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Articles</span>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{stats?.total_posts || posts.length}</div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
                  <span className="text-emerald-600 font-semibold">{stats?.published_posts || posts.filter(p => p.published).length} published</span>
                  <span>•</span>
                  <span>{stats?.draft_posts || posts.filter(p => !p.published).length} drafts</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Page Views</span>
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{stats?.total_views || 0}</div>
                <div className="text-[11px] text-indigo-600 font-semibold flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Real-time traffic</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Reader Likes</span>
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{stats?.total_likes || 0}</div>
                <div className="text-[11px] text-rose-600 font-semibold">Community appreciation</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">Subscribers</span>
                  <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{subscribers.length}</div>
                <div className="text-[11px] text-violet-600 font-semibold">Newsletter readership</div>
              </div>
            </div>

            {/* Two Column Summary Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Recent Articles (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Recent Publications</h3>
                  <button
                    onClick={() => setCurrentTab("posts")}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    View All Articles →
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.ID} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/60 px-2 rounded-lg transition">
                      <div className="space-y-1">
                        <Link
                          href={`/posts/${post.ID}`}
                          target="_blank"
                          className="text-sm font-bold text-slate-900 hover:text-indigo-600 block line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                          <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {post.category || "Faith"}
                          </span>
                          <span>{new Date(post.CreatedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{post.views || 0} views</span>
                          <span>•</span>
                          <span>{post.likes || 0} likes</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          onClick={() => startEdit(post)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.ID)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Recent Activity (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Recent Inquiries */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">Recent Letters</h3>
                    <button
                      onClick={() => setCurrentTab("messages")}
                      className="text-xs text-indigo-600 font-semibold"
                    >
                      View ({messages.length})
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No correspondence yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.slice(0, 3).map((m) => (
                        <div key={m.ID} className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{m.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {new Date(m.CreatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-600 line-clamp-2">{m.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Comments */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">Latest Comments</h3>
                    <button
                      onClick={() => setCurrentTab("comments")}
                      className="text-xs text-indigo-600 font-semibold"
                    >
                      View ({comments.length})
                    </button>
                  </div>

                  {comments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No comments yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {comments.slice(0, 3).map((c) => (
                        <div key={c.ID} className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{c.author}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {new Date(c.CreatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-600 line-clamp-2 italic">&ldquo;{c.content}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ARTICLES DATA TABLE */}
        {currentTab === "posts" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles by title or topic..."
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <span className="text-slate-500 font-medium">Topic:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="All">All Topics</option>
                  {categoryList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    resetEditor();
                    setCurrentTab("editor");
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Essay</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Title & Excerpt</th>
                    <th className="py-3 px-4">Topic</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Views</th>
                    <th className="py-3 px-4 text-center">Likes</th>
                    <th className="py-3 px-4 text-center">Comments</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        No articles found. Click &ldquo;New Essay&rdquo; to create one!
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.ID} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                          <Link
                            href={`/posts/${post.ID}`}
                            target="_blank"
                            className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1 block text-sm"
                          >
                            {post.title}
                          </Link>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {post.summary || post.content}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md text-[11px]">
                            {post.category || "Faith"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              post.published
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                          {post.views || 0}
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                          {post.likes || 0}
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                          {post.comments?.length || 0}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <Link
                              href={`/posts/${post.ID}`}
                              target="_blank"
                              title="View Live"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => startEdit(post)}
                              title="Edit"
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.ID)}
                              title="Delete"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                            >
                              <Trash2 className="w-4 h-4" />
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

        {/* TAB 3: ARTICLE WRITER & MARKDOWN EDITOR */}
        {currentTab === "editor" && (
          <form onSubmit={handleSavePost} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingPostId ? "Revise Chronicle Essay" : "Draft New Chronicle Essay"}
                </h3>
                <p className="text-xs text-slate-500">
                  Compose your thoughts with typography formatting, cover image, and metadata.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    showPreview
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  {showPreview ? "Back to Edit" : "Live Preview"}
                </button>
                {editingPostId && (
                  <button
                    type="button"
                    onClick={resetEditor}
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
                    title="Cancel Edit"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {showPreview ? (
              /* Live Preview Mode */
              <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 space-y-4 font-serif">
                <div className="text-xs uppercase font-sans font-bold text-slate-400">
                  PREVIEW: {category} • {new Date().toLocaleDateString()}
                </div>
                <h1 className="text-3xl font-bold text-[#162f4d]">{title || "Untitled Essay"}</h1>
                {summary && <p className="text-base italic text-slate-600">{summary}</p>}
                {imageUrl && (
                  <div className="h-64 rounded-lg overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="text-slate-800 leading-relaxed whitespace-pre-wrap pt-4 border-t border-slate-200">
                  {content || "No content written yet."}
                </div>
              </div>
            ) : (
              /* Editor Form */
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Essay Headline *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sundays at the Round Oak Table"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Topic / Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                {/* Cover Image URL */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Cover Illustration / Photography URL (Optional)
                  </label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                  {imageUrl && (
                    <div className="mt-2 w-48 h-28 rounded-lg overflow-hidden border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Opening Excerpt */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Short Abstract / Excerpt
                  </label>
                  <textarea
                    rows={2}
                    placeholder="A brief opening hook for the ledger feed..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white leading-relaxed"
                  ></textarea>
                </div>

                {/* Content with Toolbar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Manuscript Body *
                    </label>

                    {/* Quick Markdown Toolbar */}
                    <div className="flex items-center space-x-1 text-slate-500">
                      <button
                        type="button"
                        onClick={() => insertMarkdown("**Bold Text**")}
                        className="p-1 hover:bg-slate-100 rounded"
                        title="Bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("*Italic Text*")}
                        className="p-1 hover:bg-slate-100 rounded"
                        title="Italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("## Subheading\n")}
                        className="p-1 hover:bg-slate-100 rounded"
                        title="Heading"
                      >
                        <Heading className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("> Quote text\n")}
                        className="p-1 hover:bg-slate-100 rounded"
                        title="Quote"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={14}
                    placeholder="Compose the full essay manuscript here..."
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  ></textarea>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span>Publish Immediately to Front Page</span>
                  </label>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={resetEditor}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold tracking-wide transition flex items-center space-x-2 shadow-sm shadow-indigo-600/30 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? "Transmitting..." : editingPostId ? "Update Essay" : "Publish to Chronicle"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        )}

        {/* TAB 4: COMMENTS MODERATION */}
        {currentTab === "comments" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Reader Discussions & Responses ({comments.length})
              </h3>
              <span className="text-xs text-slate-400">Moderation Feed</span>
            </div>

            <div className="divide-y divide-slate-100">
              {comments.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  No reader responses currently in the queue.
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.ID} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-bold text-slate-900">{c.author}</span>
                        {c.email && <span className="text-slate-400">({c.email})</span>}
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400">
                          {new Date(c.CreatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-serif whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {c.content}
                      </p>
                      <span className="text-[11px] text-indigo-600 font-medium">Associated Essay #{c.post_id}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteComment(c.ID)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center space-x-1 shrink-0"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: INBOX & LETTERS */}
        {currentTab === "messages" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Editorial Correspondence & Inquiries ({messages.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  No incoming letters in the correspondence inbox.
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.ID} className="py-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{m.name}</span>
                        <a
                          href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Castle Chronicle Inquiry")}`}
                          className="text-indigo-600 hover:underline"
                        >
                          &lt;{m.email}&gt;
                        </a>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        Received on {new Date(m.CreatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {m.subject && (
                      <div className="text-xs font-bold text-slate-800">
                        Subject: {m.subject}
                      </div>
                    )}

                    <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200/80 leading-relaxed whitespace-pre-wrap">
                      {m.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: DISPATCH SUBSCRIBERS */}
        {currentTab === "subscribers" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Newsletter & Dispatch Subscribers ({subscribers.length})
                </h3>
                <p className="text-xs text-slate-400">Readers enrolled for email publications.</p>
              </div>

              {subscribers.length > 0 && (
                <button
                  onClick={handleCopySubscribers}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  {copiedEmails ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmails ? "Copied All Emails" : "Copy Mailing List"}</span>
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {subscribers.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  No subscribers registered yet.
                </div>
              ) : (
                subscribers.map((s, idx) => (
                  <div key={s.ID} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400 font-bold w-6">{idx + 1}.</span>
                      <span className="font-semibold text-slate-900">{s.email}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(s.CreatedAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

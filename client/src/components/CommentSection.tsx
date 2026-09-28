"use client";

import { useState } from "react";
import { Comment } from "@/types";
import { api } from "@/lib/api";
import { MessageSquare, Send, User as UserIcon, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

interface CommentSectionProps {
  postId: number;
  initialComments: Comment[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        author,
        email,
        content,
      });

      setComments([res.data.data, ...comments]);
      setContent("");
      setStatus({ type: "success", message: "Comment posted successfully!" });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || "Failed to post comment. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8 pt-10 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <span>Comments ({comments.length})</span>
        </h3>
        <span className="text-xs text-gray-400">Join the discussion</span>
      </div>

      {/* Add Comment Form */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-800 mb-4">Leave a Response</h4>

        {status && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 mb-4 ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Your Name *</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Comment Content *</label>
            <textarea
              rows={3}
              placeholder="Write your thoughts or ask a question..."
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium shadow-sm shadow-indigo-600/25 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? "Posting..." : "Post Comment"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-400 text-xs">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.ID}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2 hover:border-gray-200 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                    {comment.author.slice(0, 2)}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-900">{comment.author}</h5>
                    <span className="text-[10px] text-gray-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(comment.CreatedAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed pl-10 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

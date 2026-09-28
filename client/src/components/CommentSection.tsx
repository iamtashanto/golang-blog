"use client";

import { useState } from "react";
import { Comment } from "@/types";
import { api } from "@/lib/api";
import { MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";

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
      setStatus({ type: "success", message: "Your response has been published." });
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
    <section className="space-y-8 pt-10 border-t border-neutral-300 font-serif">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
        <h3 className="text-xl font-bold text-neutral-900">
          Reader Responses ({comments.length})
        </h3>
        <span className="text-[11px] font-sans uppercase tracking-widest text-neutral-400">
          Discussion
        </span>
      </div>

      {/* Add Comment Form */}
      <div className="bg-[#f7f6f2] p-6 border border-neutral-200 space-y-4">
        <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-800 font-sans">
          Leave a Written Response
        </h4>

        {status && (
          <div
            className={`p-3 text-xs flex items-center space-x-2 ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1 font-sans uppercase tracking-wider">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-none focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1 font-sans uppercase tracking-wider">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-none focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1 font-sans uppercase tracking-wider">
              Your Remarks *
            </label>
            <textarea
              rows={3}
              placeholder="Join the discussion or add your thoughts on this essay..."
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-none focus:outline-none focus:border-neutral-900 font-serif leading-relaxed"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Submit Response"}
            </button>
          </div>
        </form>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 text-xs italic">
            No responses yet recorded on this chronicle.
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.ID}
              className="p-4 bg-white border border-neutral-200/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-neutral-900 font-sans">
                  {comment.author}
                </span>
                <span className="text-[10px] text-neutral-400 font-sans">
                  {new Date(comment.CreatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-serif whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

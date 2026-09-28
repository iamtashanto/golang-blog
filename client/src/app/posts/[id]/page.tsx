"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Post } from "@/types";
import { api } from "@/lib/api";
import CommentSection from "@/components/CommentSection";
import { Eye, ThumbsUp, ArrowLeft, Share2, Check } from "lucide-react";
import Link from "next/link";

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.data);
        setLikes(res.data.data.likes || 0);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!post) return;
    try {
      const res = await api.post(`/posts/${post.ID}/like`);
      setLikes(res.data.likes);
      setLiked(true);
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="h-4 bg-neutral-200 w-24"></div>
        <div className="h-10 bg-neutral-200 w-4/5"></div>
        <div className="h-64 bg-neutral-200"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-neutral-800">Essay not found</h2>
        <p className="text-xs text-neutral-500 font-serif">The article you are looking for might have been retired from the chronicle.</p>
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-neutral-900 underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Index</span>
        </Link>
      </div>
    );
  }

  const words = (post.content || "").trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  const formattedDate = new Date(post.CreatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-black font-serif transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Chronicles</span>
        </Link>
      </div>

      {/* Header & Byline */}
      <div className="space-y-4 border-b border-neutral-300 pb-6">
        <div className="text-[11px] font-bold tracking-[0.2em] text-neutral-500 uppercase font-sans">
          {post.category || "GENERAL"} • {formattedDate} • {readingTime} MIN READ
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-base sm:text-lg font-serif italic text-neutral-600 leading-relaxed">
            {post.summary}
          </p>
        )}

        <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 font-serif">
          <span>By Editorial Columnist</span>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 font-sans text-xs">
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span>{post.views || 0} views</span>
            </span>

            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 font-sans text-xs hover:text-neutral-900 transition ${
                liked ? "text-rose-600 font-bold" : ""
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1 hover:text-neutral-900 transition"
              title="Copy Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image (if available) */}
      {post.image_url && (
        <div className="w-full h-72 sm:h-96 bg-neutral-100 border border-neutral-300 overflow-hidden shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover grayscale contrast-110"
          />
        </div>
      )}

      {/* Body Content */}
      <div className="font-serif text-base sm:text-lg text-neutral-900 leading-relaxed space-y-6 whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Article Footer & Like Action Box */}
      <div className="border-t border-b border-neutral-200 py-6 my-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-serif text-xs text-neutral-600">
        <div>
          <p className="font-bold text-neutral-900">Found value in this chronicle?</p>
          <p className="text-[11px] text-neutral-500">Record your appreciation with a like or share with your fellow engineers.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleLike}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition ${
              liked
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-800 border-neutral-300 hover:border-neutral-900"
            }`}
          >
            {liked ? `Appreciated (${likes})` : `Like Essay (${likes})`}
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 transition"
          >
            {copied ? "Link Copied" : "Share Article"}
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection postId={post.ID} initialComments={post.comments || []} />
    </article>
  );
}

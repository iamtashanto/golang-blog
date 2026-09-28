"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Post } from "@/types";
import { api } from "@/lib/api";
import CommentSection from "@/components/CommentSection";
import { 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Check, 
  User, 
  Bookmark, 
  Sparkles,
  Layers
} from "lucide-react";
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
      <div className="max-w-4xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
        <div className="h-72 bg-gray-100 rounded-3xl"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          <div className="h-4 bg-gray-100 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Article not found</h2>
        <p className="text-sm text-gray-500">The post you are looking for might have been removed or is temporarily unavailable.</p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

  const words = (post.content || "").trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <article className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-1.5 hover:text-indigo-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <Link href={`/categories?selected=${post.category}`} className="inline-flex items-center space-x-1 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-semibold border border-indigo-100">
            <Layers className="w-3 h-3" />
            <span>{post.category || "General"}</span>
          </Link>
          <span className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{readingTime} min read</span>
          </span>
        </div>
      </div>

      {/* Title & Metadata Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-lg text-gray-600 leading-relaxed font-light">
            {post.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100">
          {/* Author info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Tech Author</h4>
              <p className="text-[10px] text-gray-400 flex items-center space-x-1.5">
                <Calendar className="w-3 h-3" />
                <span>{new Date(post.CreatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </p>
            </div>
          </div>

          {/* Social Stats & Share */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-gray-600 border border-gray-100">
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-semibold">{post.views || 0}</span>
              <span className="text-gray-400">views</span>
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                liked
                  ? "bg-rose-50 text-rose-600 border-rose-200 shadow-sm"
                  : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-rose-500" : ""}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      {post.image_url && (
        <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-gray-100 shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Blog Post Content Body */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="prose prose-indigo max-w-none text-gray-800 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Post Footer Action Box */}
        <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60 p-6 rounded-2xl">
          <div>
            <h5 className="text-sm font-bold text-gray-900">Enjoyed this article?</h5>
            <p className="text-xs text-gray-500">Hit the like button to show your appreciation or share with friends!</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                liked
                  ? "bg-rose-500 text-white shadow-rose-500/25"
                  : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600 border border-gray-200"
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
              <span>{liked ? "Liked!" : "Like"} ({likes})</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? "Link Copied" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section Component */}
      <CommentSection postId={post.ID} initialComments={post.comments || []} />
    </article>
  );
}

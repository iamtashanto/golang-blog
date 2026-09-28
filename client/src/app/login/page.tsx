"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { LogIn, UserPlus, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";

  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (tab === "register") {
        await api.post("/auth/register", {
          name,
          email,
          password,
        });
        setSuccess("Account created successfully. You may now sign in.");
        setTab("login");
      } else {
        const res = await api.post("/auth/login", {
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        window.dispatchEvent(new Event("storage"));
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-serif">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-black font-serif"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Chronicle</span>
        </Link>
      </div>

      <div className="border border-neutral-300 bg-white p-8 space-y-6 shadow-sm">
        {/* Header */}
        <div className="text-center space-y-1 border-b border-neutral-200 pb-4">
          <h1 className="text-2xl font-serif font-bold text-neutral-900">
            {tab === "login" ? "Editorial Desk Sign In" : "Register Contributor Account"}
          </h1>
          <p className="text-xs text-neutral-500 font-sans">
            {tab === "login"
              ? "Access publishing tools and article management"
              : "First registered account is granted Admin rights"}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 text-xs font-sans font-semibold border-b border-neutral-200 text-center">
          <button
            onClick={() => {
              setTab("login");
              setError(null);
            }}
            className={`py-2 transition-all ${
              tab === "login"
                ? "border-b-2 border-neutral-900 text-neutral-900"
                : "text-neutral-400 hover:text-neutral-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab("register");
              setError(null);
            }}
            className={`py-2 transition-all ${
              tab === "register"
                ? "border-b-2 border-neutral-900 text-neutral-900"
                : "text-neutral-400 hover:text-neutral-900"
            }`}
          >
            Register
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2 font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2 font-sans">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {tab === "register" && (
            <div>
              <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Full Name
              </label>
              <input
                type="text"
                placeholder="James Castle"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-none focus:outline-none focus:border-neutral-900"
              />
            </div>
          )}

          <div>
            <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="editor@golangchronicle.org"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-none focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-none focus:outline-none focus:border-neutral-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold uppercase tracking-wider transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : tab === "login" ? "Enter Studio" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-xs font-serif text-neutral-400">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}

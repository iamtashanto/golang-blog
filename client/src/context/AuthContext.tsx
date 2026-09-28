"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyToken = useCallback(async () => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    setToken(savedToken);

    try {
      // Validate token with backend
      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        throw new Error("Invalid user payload");
      }
    } catch {
      // Token is expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const res = await api.post("/auth/login", { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    localStorage.setItem("token", receivedToken);
    localStorage.setItem("role", receivedUser.role);
    localStorage.setItem("user", JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await verifyToken();
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(isAuthenticated && user?.role === "admin");

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

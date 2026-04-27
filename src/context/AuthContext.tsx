"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/services/auth";
import { useRouter } from "next/navigation";
import api from "@/services/api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOwner: boolean;     // role === 'OWNER'
  isAdmin: boolean;     // role === 'ADMIN'
  login: (userData: User, access: string, refresh: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshRole: () => Promise<void>;  // Force re-fetch from /api/v1/me/
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Helper: derive role booleans
  const isOwner = user?.role === "OWNER";
  const isAdmin = user?.role === "ADMIN";

  // ── refreshRole: call /api/v1/me/ and update user state with fresh data ──
  const refreshRole = useCallback(async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await api.get("/me/");
      if (response.data) {
        const freshUser: Partial<User> = {
          role: response.data.role as UserRole,
          is_verified: response.data.is_verified,
          subscription_plan: response.data.subscription_plan,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
        };
        setUser((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, ...freshUser };
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error("Role refresh failed", err);
    }
  }, []);

  // ── Init: load session from localStorage, then refresh role from backend ──
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("access_token");

      if (storedUser && accessToken) {
        const parsedUser = JSON.parse(storedUser) as User;
        // Ensure legacy stored users have a role field
        if (!parsedUser.role) parsedUser.role = "USER";
        if (parsedUser.is_verified === undefined) parsedUser.is_verified = false;

        setUser(parsedUser);
        setIsAuthenticated(true);

        // 🚀 Always refresh role from backend (catches admin promotions mid-session)
        try {
          const response = await api.get("/me/");
          if (response.data) {
            const updatedUser: User = {
              ...parsedUser,
              role: response.data.role as UserRole,
              is_verified: response.data.is_verified,
              subscription_plan: response.data.subscription_plan,
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              email: response.data.email,
            };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        } catch (err) {
          // Not critical — use stored user data silently
          console.warn("Could not refresh role from backend:", err);
        }
      }
    };

    initAuth();
  }, []);

  // ── login: store tokens + user, then fetch fresh role ────────────────────
  const login = useCallback(async (userData: User, access: string, refresh: string) => {
    // Spread first, then apply defaults only if backend didn't send them
    const userWithRole: User = {
      ...userData,
      role: userData.role ?? "USER",
      is_verified: userData.is_verified ?? false,
    };

    setUser(userWithRole);
    setIsAuthenticated(true);

    localStorage.setItem("user", JSON.stringify(userWithRole));
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    document.cookie = `access_token=${access}; path=/; max-age=86400`;

    // 🚀 Immediately refresh role from backend after login
    try {
      const response = await api.get("/me/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (response.data) {
        const updatedUser: User = {
          ...userWithRole,
          role: response.data.role as UserRole,
          is_verified: response.data.is_verified,
          subscription_plan: response.data.subscription_plan,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.warn("Post-login role refresh failed:", err);
    }
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = `access_token=; path=/; max-age=0`;

    router.push("/");
  }, [router]);

  // ── updateUser ────────────────────────────────────────────────────────────
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newUser = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isOwner, isAdmin, login, logout, updateUser, refreshRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

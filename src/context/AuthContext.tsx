"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/services/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, access: string, refresh: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Load session on startup
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("access_token");

      if (storedUser && accessToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);

        // 🚀 SYNC PROFILE FROM SUPABASE (Ensure photo is always fresh)
        try {
          const { data, error } = await supabase
            .from('auth_user')
            .select('first_name, last_name, profile_image')
            .eq('id', parsedUser.id)
            .single();
          
          if (data && !error) {
            const updatedUser = { ...parsedUser, ...data };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        } catch (err) {
          console.error("Profile sync failed", err);
        }
      }
    };

    initAuth();
  }, []);

  const login = (userData: User, access: string, refresh: string) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Store tokens in localStorage for axios interceptor
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    
    // Sync to cookie for potential Server Component reading (Optional but useful)
    document.cookie = `access_token=${access}; path=/; max-age=86400`;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = `access_token=; path=/; max-age=0`;
    
    router.push("/");
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updates };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

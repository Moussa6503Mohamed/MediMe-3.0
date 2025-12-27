"use client";
import { useAppStore } from "@/store/app-store";
import { useUser } from "@/firebase";
import { useEffect } from "react";

export const useAuth = () => {
  const { login, logout, isLoggedIn, currentUser } = useAppStore();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading) {
      if (user && !isLoggedIn) {
        login(user);
      } else if (!user && isLoggedIn) {
        logout();
      }
    }
  }, [user, isUserLoading, isLoggedIn, login, logout]);

  return {
    isLoggedIn: !!user,
    currentUser: user,
    isUserLoading,
    login,
    logout,
  };
};

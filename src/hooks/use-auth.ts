"use client";
import { useAppStore } from "@/store/app-store";

export const useAuth = () => {
  const { isLoggedIn, currentUser, login, logout } = useAppStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    currentUser: state.currentUser,
    login: state.login,
    logout: state.logout,
  }));

  const createAccount = (userData: any) => {
    // In a real app, this would hit an API
    console.log("Creating account:", userData);
    login(userData);
  };

  return { isLoggedIn, currentUser, login, logout, createAccount };
};

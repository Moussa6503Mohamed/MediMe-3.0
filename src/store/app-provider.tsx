"use client";
import { AppStoreProvider } from "./app-store";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppStoreProvider>{children}</AppStoreProvider>;
}

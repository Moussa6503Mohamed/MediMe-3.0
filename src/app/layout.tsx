import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import AppProvider from "@/store/app-provider";
import { FirebaseClientProvider } from "@/firebase";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "MediMe Healthcare Platform",
  description: "Your Personal Health Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cairo.variable} font-inter`}>
        <FirebaseClientProvider>
          <AppProvider>{children}</AppProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

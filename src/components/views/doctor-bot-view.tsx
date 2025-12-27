"use client";

import { useAppStore } from "@/store/app-store";
import AiDoctorBot from "@/components/ai-doctor-bot";
import { Header } from "./header";
import { Bot } from "lucide-react";

export default function DoctorBotView() {
  return (
    <div>
      <Header title="DoctorBot AI Chat" icon={<Bot />} backPage="home" />
      <div className="h-[calc(100vh-150px)]">
        <AiDoctorBot />
      </div>
    </div>
  );
}

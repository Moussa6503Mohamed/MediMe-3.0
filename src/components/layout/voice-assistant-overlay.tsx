"use client";

import { useAppStore } from "@/store/app-store";
import { Mic } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

const VoiceAssistantOverlay = () => {
  const { isVoiceAssistantActive, stopVoiceAssistant } = useAppStore();
  const { t } = useI18n();

  if (!isVoiceAssistantActive) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center transition-opacity duration-300"
      onClick={stopVoiceAssistant}
    >
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-2xl cursor-pointer transition duration-300 hover:scale-[1.02]">
        <div className="relative p-6 rounded-full bg-red-100 mb-4">
          <Mic className="w-12 h-12 text-red-600" />
          <div className="absolute inset-0 m-auto w-16 h-16 bg-red-400 rounded-full animate-pulse-ring"></div>
        </div>
        <p className="text-xl font-bold text-gray-800">
          {t("listeningForCommand")}
        </p>
        <p className="text-sm text-gray-500 mt-1">{t("sayCommand")}</p>
      </div>
    </div>
  );
};

export default VoiceAssistantOverlay;

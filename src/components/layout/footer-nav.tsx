
"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { Home, Calendar, Pill, Users, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { startVoiceAssistant } from "@/lib/voice";

const FooterNav = () => {
  const {
    currentPage,
    navigate,
    isVoiceAssistantActive,
    startVoiceAssistant: start,
    stopVoiceAssistant: stop,
  } = useAppStore();
  const { t } = useI18n();

  const handleMicClick = () => {
    startVoiceAssistant(isVoiceAssistantActive, start, stop, t);
  };

  const navItems = [
    {
      page: "home",
      label: t("home"),
      icon: Home,
      check: (page: string) => page === "home",
    },
    {
      page: "calendar-view",
      label: t("schedule"),
      icon: Calendar,
      check: (page: string) =>
        page.includes("calendar") || page.includes("schedule"),
    },
    {
      page: "medication-manager-view",
      label: t("meds"),
      icon: Pill,
      check: (page: string) =>
        page.includes("medication") || page.includes("refill"),
    },
    {
      page: "family-list",
      label: t("family"),
      icon: Users,
      check: (page: string) =>
        page.includes("family") || page.includes("member"),
    },
  ];

  return (
    <nav className="bg-white rounded-3xl shadow-xl p-3 border border-gray-100 w-full mx-auto flex justify-around items-center space-x-2 max-w-md">
      {navItems.slice(0, 2).map((item) => (
        <button
          key={item.page}
          onClick={() => navigate(item.page)}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-xl transition duration-150 transform scale-100 active:scale-95",
            item.check(currentPage)
              ? "text-primary bg-primary/10"
              : "text-gray-500 hover:text-primary"
          )}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}

      <button
        onClick={handleMicClick}
        className={cn(
          "relative p-4 rounded-full shadow-xl transition duration-300 transform scale-100 active:scale-95 text-white",
          isVoiceAssistantActive
            ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 animate-pulse"
            : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        )}
      >
        <Mic className="w-7 h-7" />
        {isVoiceAssistantActive && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {navItems.slice(2).map((item) => (
        <button
          key={item.page}
          onClick={() => navigate(item.page)}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-xl transition duration-150 transform scale-100 active:scale-95",
            item.check(currentPage)
              ? "text-primary bg-primary/10"
              : "text-gray-500 hover:text-primary"
          )}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default FooterNav;

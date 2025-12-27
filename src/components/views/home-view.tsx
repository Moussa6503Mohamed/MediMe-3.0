"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import {
  AlertTriangle,
  Bell,
  Globe,
  Stethoscope,
  Zap,
  Calendar,
  Pill,
  FileText,
  Users,
  Heart,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export default function HomeView() {
  const { navigate } = useAppStore();
  const { t, language, setLanguage } = useI18n();
  const { currentUser } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const actionButtons = [
    { id: "appointments", labelKey: "mySchedule", icon: <Calendar />, color: "bg-purple-600", descriptionKey: "myScheduleDesc", nav: 'calendar-view' },
    { id: "consult-doctor", labelKey: "bookMe", icon: <Stethoscope />, color: "bg-teal-600", descriptionKey: "bookMeDesc", nav: 'schedule-doctor-view' },
    { id: "medication-manager", labelKey: 'myMedication', icon: <Pill />, color: "bg-cyan-700", descriptionKey: 'myMedicationDesc', nav: 'medication-manager-view' },
    { id: "doctors-reports", labelKey: "myReports", icon: <FileText />, color: "bg-indigo-600", descriptionKey: "myReportsDesc", nav: 'reports-list-view' },
    { id: "family-care", labelKey: "familyCare", icon: <Users />, color: "bg-orange-600", descriptionKey: "familyCareDesc", nav: 'family-list' },
    { id: "doctor-bot", labelKey: "doctorBot", icon: <Heart />, color: "bg-pink-600", descriptionKey: "doctorBotDesc", nav: 'doctor-bot' },
    { id: "chat-summary", labelKey: "mySummary", icon: <Briefcase />, color: "bg-rose-600", descriptionKey: "mySummaryDesc", nav: 'chat-summary-view' },
  ];

  return (
    <div className="pb-safe-footer">
      <div className="flex justify-between items-center mb-6">
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("profile-view")}
        >
          <Avatar className="w-12 h-12 border-2 border-primary">
            <AvatarFallback>
              {currentUser?.displayName
                ?.split(" ")
                .map((n) => n[0])
                .join("") || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">{t("welcomeBack")}</p>
            <h1 className="text-xl font-bold text-gray-800">
              {currentUser?.displayName || 'User'}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("notifications-view")}
            className="relative"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-red-500" /> {t("latestAlert")}
        </h2>
        <div
          className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm cursor-pointer hover:bg-red-100 transition"
          onClick={() => navigate("medication-manager-view")}
        >
          <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              {t("newPrescriptionAlert")}
            </p>
            <p className="text-xs text-red-600">{t("tapToManageRefill")}</p>
          </div>
        </div>
      </div>

      <div className="mb-8 p-4 bg-white border border-gray-100 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Stethoscope className="w-5 h-5 mr-2 text-purple-600" />{" "}
          {t("nextAppointment")}
        </h2>
        <p className="text-lg font-bold text-gray-700">
          {t("cardiologyCheckup").split(" - ")[0]}
        </p>
        <p className="text-sm text-gray-500">
          {t("cardiologyCheckup").split(" - ")[1]}
        </p>
        <Button
          onClick={() => navigate("calendar-view")}
          variant="outline"
          className="mt-4 w-full"
        >
          {t("viewFullSchedule")}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actionButtons.map((btn) => (
          <div
            key={btn.id}
            className={`${btn.color} p-5 rounded-xl shadow-md flex flex-col items-start justify-between h-32 cursor-pointer transition transform hover:scale-[1.02]`}
            onClick={() => navigate(btn.nav as any)}
          >
            <div className="text-white">{btn.icon}</div>
            <div className="mt-2">
              <p className="text-lg font-semibold text-white">
                {t(btn.labelKey as any)}
              </p>
              <p className="text-xs text-white opacity-80">
                {t(btn.descriptionKey as any)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

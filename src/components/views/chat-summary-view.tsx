"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bot, FileBarChart, Leaf, Siren } from "lucide-react";
import { Header } from "./header";

const FeverIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-thermometer"
    >
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  );

export default function ChatSummaryView() {
  const { navigate } = useAppStore();
  const { t } = useI18n();

  const chatSummaries = [
    {
      title: t("coughFeverTitle"),
      date: "Dec 1, 2023",
      symptoms: t("coughFeverSymptoms"),
      recommendations: t("coughFeverRecs"),
      alert: t("coughFeverAlert"),
      color: "bg-red-50",
      icon: <FeverIcon />,
    },
    {
      title: t("allergyTitle"),
      date: "Nov 20, 2023",
      symptoms: t("allergySymptoms"),
      recommendations: t("allergyRecs"),
      alert: t("allergyAlert"),
      color: "bg-green-50",
      icon: <Leaf />,
    },
  ];

  return (
    <div className="pb-safe-footer">
      <Header
        title={t("mySummary")}
        icon={<FileBarChart />}
        backPage="home"
      />
      <p className="text-muted-foreground mb-6">{t("summaryViewDescription")}</p>

      <div className="space-y-4">
        {chatSummaries.map((summary, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl shadow-md border border-gray-100 ${summary.color} flex flex-col`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <div className="w-8 h-8 flex items-center justify-center mr-2 text-gray-600">
                    {summary.icon}
                </div>
                {summary.title}
              </h3>
              <span className="text-sm text-gray-500">{summary.date}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
              <p className="text-sm">
                <span className="font-semibold text-gray-700">
                  {t("symptomsLabel")}
                </span>{" "}
                {summary.symptoms}
              </p>
              <p className="text-sm">
                <span className="font-semibold text-gray-700">
                  {t("recsLabel")}
                </span>{" "}
                {summary.recommendations}
              </p>
              <p className="text-xs font-bold text-red-600 flex items-center pt-2 mt-2 border-t border-gray-100">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {t("actionLabel")} {summary.alert}
              </p>
            </div>
          </div>
        ))}
        <div className="p-4 bg-gray-50 rounded-xl shadow-inner border border-gray-200 text-center">
          <Button
            variant="link"
            className="text-primary font-semibold"
            onClick={() => navigate("doctor-bot")}
          >
            <Bot className="w-5 h-5 mr-2" />
            {t("continueChatting")}
          </Button>
        </div>
      </div>
    </div>
  );
}

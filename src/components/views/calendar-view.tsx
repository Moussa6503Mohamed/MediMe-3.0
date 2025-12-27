"use client";

import { useAppStore } from "@/store/app-store";
import { dailySchedule } from "@/lib/data";
import { format, setDate, getDate, getDaysInMonth } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Check,
  ChevronDown,
  Pill,
  Plus,
  Stethoscope,
  TestTube,
  Square,
} from "lucide-react";
import { Header } from "./header";

export default function CalendarView() {
  const { navigate, selectedDay, setSelectedDay } = useAppStore();
  const { t, language } = useI18n();

  const today = new Date();
  const selectedDateObj = setDate(today, selectedDay);
  const locale = language === "ar" ? arSA : enUS;

  const daysInMonth = getDaysInMonth(today);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const scheduleForDay = dailySchedule.filter(
    (item) => getDate(new Date(item.date)) === selectedDay
  );

  return (
    <div className="pb-safe-footer">
      <Header title={t("schedule")} icon={<Calendar />} backPage="home" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(today, "MMMM yyyy", { locale })}
        </h2>
        <button
          onClick={() => {
            /* Open month picker logic */
          }}
          className="text-primary hover:text-primary/80"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-3 pb-4 mb-6">
        {calendarDays.map((day) => {
          const dayDate = setDate(today, day);
          const isSelected = day === selectedDay;
          const isToday = day === getDate(new Date());
          return (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex flex-col items-center justify-center w-12 h-16 rounded-xl transition-colors cursor-pointer flex-shrink-0",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-primary/10",
                isToday && !isSelected ? "border-2 border-primary" : ""
              )}
            >
              <p className="text-xs">
                {format(dayDate, "E", { locale }).substring(0, 3)}
              </p>
              <p className="text-lg font-bold">{day}</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {t("scheduleHeading", {
            date: format(selectedDateObj, "PPPP", { locale }),
          })}
        </h3>
        <button
          onClick={() => navigate("add-appointment-form")}
          className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {scheduleForDay.length > 0 ? (
          scheduleForDay.map((item) => <ScheduleItem key={item.id} item={item} />)
        ) : (
          <p className="text-muted-foreground italic p-4 bg-gray-50 rounded-xl">
            {t("noActivities")}
          </p>
        )}
      </div>
    </div>
  );
}

const ScheduleItem = ({ item }: { item: (typeof dailySchedule)[0] }) => {
  const { navigate } = useAppStore();
  const { t } = useI18n();

  const getIcon = (type: string) => {
    switch (type) {
      case "Medication":
        return <Pill className="w-5 h-5" />;
      case "Appointment":
        return <Stethoscope className="w-5 h-5" />;
      case "Test":
        return <TestTube className="w-5 h-5" />;
      default:
        return <Pill className="w-5 h-5" />;
    }
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would update the state
    console.log("Toggling completion for", item.id);
  };

  return (
    <div className="flex items-start space-x-4">
      <div className="flex flex-col items-center mt-1">
        <p className="text-sm font-bold text-gray-700">{item.time}</p>
      </div>
      <div
        className={cn(
          "flex-1 p-4 rounded-xl shadow-md border cursor-pointer",
          item.isCompleted
            ? "bg-green-100 border-green-300"
            : "bg-white border-gray-100 hover:bg-gray-50"
        )}
        onClick={() => {
          navigate("schedule-detail-view", { scheduleItemId: item.id });
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className={cn("p-1 rounded-full", item.color)}>
              {getIcon(item.type)}
            </div>
            <p className={cn("text-sm font-semibold", item.textColor)}>
              {t(item.type.toLowerCase() as any)}
            </p>
          </div>
          <button
            onClick={handleToggleComplete}
            className={cn(
              "p-1 rounded-full transition-colors",
              item.isCompleted
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-600"
            )}
          >
            {item.isCompleted ? (
              <Check className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
        </div>
        <h3
          className={cn(
            "text-xl font-bold mt-2",
            item.isCompleted ? "text-green-800 line-through" : "text-gray-800"
          )}
        >
          {item.title}
        </h3>
        <p
          className={cn(
            "text-sm text-gray-500",
            item.isCompleted ? "line-through" : ""
          )}
        >
          {item.detail}
        </p>
      </div>
    </div>
  );
};

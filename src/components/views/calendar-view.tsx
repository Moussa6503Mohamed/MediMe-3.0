"use client";

import { useAppStore } from "@/store/app-store";
import { format, setDate, getDate, getDaysInMonth, parseISO } from "date-fns";
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
import { useAuth } from "@/hooks/use-auth";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Appointment } from "@/lib/types";

export default function CalendarView() {
  const { navigate, selectedDay, setSelectedDay } = useAppStore();
  const { t, language } = useI18n();
  const { currentUser } = useAuth();
  const firestore = useFirestore();

  const today = new Date();
  const selectedDateObj = setDate(today, selectedDay);
  selectedDateObj.setHours(0, 0, 0, 0);

  const startOfDay = selectedDateObj.toISOString();
  const endOfDay = new Date(selectedDateObj.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString();
  
  const appointmentsQuery = useMemoFirebase(() => {
    if (!currentUser) return null;
    return query(
      collection(firestore, 'patients', currentUser.uid, 'appointments'),
      where('appointmentDateTime', '>=', startOfDay),
      where('appointmentDateTime', '<=', endOfDay)
    );
  }, [firestore, currentUser, startOfDay, endOfDay]);

  const { data: scheduleForDay, isLoading } = useCollection<Appointment>(appointmentsQuery);

  const locale = language === "ar" ? arSA : enUS;

  const daysInMonth = getDaysInMonth(today);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

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
        {isLoading && <p>Loading schedule...</p>}
        {!isLoading && scheduleForDay && scheduleForDay.length > 0 ? (
          scheduleForDay.map((item) => <ScheduleItem key={item.id} item={item} />)
        ) : (
          !isLoading && <p className="text-muted-foreground italic p-4 bg-gray-50 rounded-xl">
            {t("noActivities")}
          </p>
        )}
      </div>
    </div>
  );
}

const ScheduleItem = ({ item }: { item: Appointment }) => {
  const { navigate } = useAppStore();
  
  const isCompleted = item.status === 'completed';
  const itemDateTime = parseISO(item.appointmentDateTime);

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would update the state in Firestore
    console.log("Toggling completion for", item.id);
  };

  return (
    <div className="flex items-start space-x-4">
      <div className="flex flex-col items-center mt-1">
        <p className="text-sm font-bold text-gray-700">{format(itemDateTime, 'h:mm a')}</p>
      </div>
      <div
        className={cn(
          "flex-1 p-4 rounded-xl shadow-md border cursor-pointer",
          isCompleted
            ? "bg-green-100 border-green-300"
            : "bg-white border-gray-100 hover:bg-gray-50"
        )}
        onClick={() => {
          navigate("schedule-detail-view", { activeScheduleItemId: item.id });
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className={cn("p-1 rounded-full", isCompleted ? "bg-green-200" : "bg-blue-200")}>
              <Stethoscope className="w-5 h-5" />
            </div>
            <p className={cn("text-sm font-semibold", isCompleted ? "text-green-800" : "text-blue-800")}>
              Appointment
            </p>
          </div>
          <button
            onClick={handleToggleComplete}
            className={cn(
              "p-1 rounded-full transition-colors",
              isCompleted
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-600"
            )}
          >
            {isCompleted ? (
              <Check className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
        </div>
        <h3
          className={cn(
            "text-xl font-bold mt-2",
            isCompleted ? "text-green-800 line-through" : "text-gray-800"
          )}
        >
          {item.reasonForVisit}
        </h3>
        <p
          className={cn(
            "text-sm text-gray-500",
            isCompleted ? "line-through" : ""
          )}
        >
          with {item.doctorName || 'a doctor'}
        </p>
      </div>
    </div>
  );
};

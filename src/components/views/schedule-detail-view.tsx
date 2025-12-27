"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { dailySchedule, doctors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Map,
  Notebook,
  Pill,
  Stethoscope,
  TestTube,
  Square,
  Check,
  MapPin,
  UserCheck,
  ClipboardList,
  Hospital,
  LayoutGrid,
  ExternalLink,
} from "lucide-react";
import { Header } from "./header";
import { DetailField } from "./detail-field";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ScheduleDetailView() {
  const { activeScheduleItemId, setActiveScheduleItemStatus } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();

  const item = dailySchedule.find((i) => i.id === activeScheduleItemId);

  if (!item) {
    return <div>{t("scheduleItemNotFound")}</div>;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "Medication": return <Pill />;
      case "Appointment": return <Stethoscope />;
      case "Test": return <TestTube />;
      default: return <Pill />;
    }
  };
  
  const getDoctor = (doctorName: string) => doctors.find(d => d.name === doctorName);

  const detailFields = [
    { label: t("time"), value: item.time, icon: <Clock /> },
    { label: t("type"), value: t(item.type.toLowerCase() as any), icon: getIcon(item.type) },
    item.location && { label: t("location"), value: item.location, icon: <MapPin /> },
    item.doctor && { label: t("doctor"), value: t(item.doctor.replace(/\s/g, "") as any), icon: <UserCheck /> },
    item.appointmentType && { label: t("appointmentType"), value: item.appointmentType, icon: <ClipboardList /> },
    item.facility && { label: t("facility"), value: t(item.facility.replace(/\s/g, "") as any), icon: <Hospital /> },
    item.department && { label: t("department"), value: t(item.department.replace(/\s/g, "") as any), icon: <LayoutGrid /> },
  ].filter(Boolean);

  const handleToggle = () => {
    setActiveScheduleItemStatus(item.id, !item.isCompleted);
    toast({
        title: `Marked as ${!item.isCompleted ? 'complete' : 'pending'}`,
        description: item.title,
    })
  }

  const handleDirections = () => {
    if(item.location) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`;
        window.open(url, '_blank');
    } else {
        toast({ title: "No location available."})
    }
  }

  const handleAddToCalendar = () => {
      toast({title: t("addingToCalendar")})
  }

  return (
    <div>
      <Header
        title={item.title}
        icon={getIcon(item.type)}
        backPage="calendar-view"
      />
      <div className={cn("p-5 mb-6 rounded-2xl shadow-lg border", item.isCompleted ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300')}>
        <div className="flex items-center justify-between">
            <h2 className={cn("text-xl font-bold flex items-center", item.isCompleted ? 'text-green-800' : 'text-yellow-800')}>
                {item.isCompleted ? <CheckCircle className="w-6 h-6 mr-2" /> : <Clock className="w-6 h-6 mr-2" />}
                {t('statusLabel')}: {t(item.isCompleted ? 'completed' : 'pending')}
            </h2>
            <Button size="sm" onClick={handleToggle} variant={item.isCompleted ? "default" : "secondary"} className={cn(item.isCompleted ? "bg-green-600" : "bg-yellow-600")}>
                {item.isCompleted ? t("markNotDone") : t("markDone")}
            </Button>
        </div>
        <p className={cn("text-sm mt-2", item.isCompleted ? "text-green-700" : "text-yellow-700")}>
            {item.isCompleted ? t('completedMessage') : t('pendingMessage')}
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Map className="w-6 h-6 mr-2 text-primary" /> {t('keyDetails')}
      </h3>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {detailFields.map((field, i) => field && <DetailField key={i} label={field.label} value={field.value} icon={field.icon} />)}
      </div>

      {(item.notes || item.instructions) && (
        <>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Notebook className="w-6 h-6 mr-2 text-purple-600" /> {item.type === 'Test' ? t('instructions') : t('notes')}
            </h3>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-8">
                <p className="text-gray-700">{item.notes || item.instructions}</p>
            </div>
        </>
      )}

      <div className="space-y-3">
        <Button onClick={handleDirections} className="w-full" size="lg">
            <Map className="w-5 h-5 mr-2" /> {t('getDirections')}
        </Button>
        <Button onClick={handleAddToCalendar} variant="outline" className="w-full" size="lg">
            <ExternalLink className="w-5 h-5 mr-2" /> {t('addToCalendar')}
        </Button>
      </div>
    </div>
  );
}

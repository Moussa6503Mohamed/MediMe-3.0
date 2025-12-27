"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Map,
  Notebook,
  Pill,
  Stethoscope,
  TestTube,
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
import { useAuth } from "@/hooks/use-auth";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Appointment } from "@/lib/types";
import { format, parseISO } from "date-fns";

export default function ScheduleDetailView() {
  const { activeScheduleItemId, setActiveScheduleItemStatus } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const firestore = useFirestore();

  const appointmentDocRef = useMemoFirebase(() => {
    if (!currentUser || !activeScheduleItemId) return null;
    return doc(firestore, 'patients', currentUser.uid, 'appointments', activeScheduleItemId);
  }, [firestore, currentUser, activeScheduleItemId]);

  const { data: item, isLoading } = useDoc<Appointment>(appointmentDocRef);

  if (isLoading) {
    return <div>Loading details...</div>
  }

  if (!item) {
    return <div>{t("scheduleItemNotFound")}</div>;
  }
  
  const isCompleted = item.status === 'completed';
  const itemDateTime = parseISO(item.appointmentDateTime);

  const detailFields = [
    { label: t("time"), value: format(itemDateTime, 'h:mm a'), icon: <Clock /> },
    { label: t("type"), value: t('appointment'), icon: <Stethoscope /> },
    item.notes && { label: t("location"), value: item.notes, icon: <MapPin /> },
    item.doctorName && { label: t("doctor"), value: item.doctorName, icon: <UserCheck /> },
    item.specialty && { label: t("appointmentType"), value: item.specialty, icon: <ClipboardList /> },
  ].filter(Boolean);

  const handleToggle = () => {
    // In a real app, update Firestore
    toast({
        title: `Marked as ${!isCompleted ? 'complete' : 'pending'}`,
        description: item.reasonForVisit,
    })
  }

  const handleDirections = () => {
    if(item.notes) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.notes)}`;
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
        title={item.reasonForVisit}
        icon={<Stethoscope />}
        backPage="calendar-view"
      />
      <div className={cn("p-5 mb-6 rounded-2xl shadow-lg border", isCompleted ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300')}>
        <div className="flex items-center justify-between">
            <h2 className={cn("text-xl font-bold flex items-center", isCompleted ? 'text-green-800' : 'text-yellow-800')}>
                {isCompleted ? <CheckCircle className="w-6 h-6 mr-2" /> : <Clock className="w-6 h-6 mr-2" />}
                {t('statusLabel')}: {t(isCompleted ? 'completed' : 'pending')}
            </h2>
            <Button size="sm" onClick={handleToggle} variant={isCompleted ? "default" : "secondary"} className={cn(isCompleted ? "bg-green-600" : "bg-yellow-600")}>
                {isCompleted ? t("markNotDone") : t("markDone")}
            </Button>
        </div>
        <p className={cn("text-sm mt-2", isCompleted ? "text-green-700" : "text-yellow-700")}>
            {isCompleted ? t('completedMessage') : t('pendingMessage')}
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Map className="w-6 h-6 mr-2 text-primary" /> {t('keyDetails')}
      </h3>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {detailFields.map((field, i) => field && <DetailField key={i} label={field.label} value={field.value} icon={field.icon} />)}
      </div>

      {item.notes && (
        <>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Notebook className="w-6 h-6 mr-2 text-purple-600" /> {t('notes')}
            </h3>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-8">
                <p className="text-gray-700">{item.notes}</p>
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

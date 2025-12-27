"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarCheck,
  Clock,
  Home,
  MapPin,
  UserCheck,
} from "lucide-react";
import { DetailField } from "./detail-field";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Doctor } from "@/lib/types";

export default function AppointmentConfirmationView() {
  const { navigate, activeDoctorId, selectedDate, selectedAppointmentTime } =
    useAppStore();
  const { t } = useI18n();
  const firestore = useFirestore();

  const doctorDocRef = useMemoFirebase(() => {
    if (!activeDoctorId) return null;
    return doc(firestore, 'doctors', activeDoctorId);
  }, [firestore, activeDoctorId]);

  const { data: doctor, isLoading } = useDoc<Doctor>(doctorDocRef);


  if (isLoading) {
    return <div>Loading confirmation...</div>;
  }

  if (!doctor || !selectedAppointmentTime) {
    return <div>Error: Confirmation details are missing.</div>;
  }

  const date = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="text-center py-12">
      <div className="p-6 inline-block bg-purple-100 rounded-full mb-6">
        <CalendarCheck className="w-12 h-12 text-purple-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">
        {t("appointmentBooked")}
      </h1>
      <p className="text-lg text-gray-600 mb-8">{t("youAreAllSet")}</p>

      <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 text-left space-y-4">
        <DetailField
          label={t("doctor")}
          value={doctor.name}
          icon={<UserCheck className="text-teal-600" />}
        />
        <DetailField
          label={t("specialization")}
          value={doctor.specialization}
          icon={<UserCheck className="text-teal-600" />}
        />
        <DetailField
          label={t("appointmentTime")}
          value={`${date} at ${selectedAppointmentTime}`}
          icon={<Clock className="text-purple-600" />}
        />
        <DetailField
          label={t("location")}
          value={doctor.location}
          icon={<MapPin className="text-red-600" />}
        />
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-800">
            {t("confirmationId")}: {Math.floor(Math.random() * 1000000)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => navigate("calendar-view")}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          <Calendar className="w-5 h-5 mr-2" /> {t("viewInSchedule")}
        </Button>
        <Button
          onClick={() => navigate("home")}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Home className="w-5 h-5 mr-2" /> {t("goHome")}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { doctors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Header } from "./header";
import { DetailField } from "./detail-field";

export default function DoctorDetailsView() {
  const {
    navigate,
    activeDoctorId,
    selectedDate,
    setSelectedDate,
    selectedAppointmentTime,
    setSelectedAppointmentTime,
  } = useAppStore();
  const { t } = useI18n();

  const doctor = doctors.find((d) => d.id === activeDoctorId);

  if (!doctor) {
    return <div>{t("doctorNotFound")}</div>;
  }

  const timeSlots = [
    "10:00 AM",
    "11:30 AM",
    "02:00 PM",
    "03:30 PM",
    "04:00 PM",
    "05:30 PM",
  ];

  return (
    <div>
      <Header
        title={t("doctorProfile")}
        icon={<UserCheck />}
        backPage="schedule-doctor-view"
      />
      <div className="p-6 mb-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4 mb-4 pb-4 border-b">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
            <p className="text-lg font-medium text-teal-600">
              {doctor.specialization}
            </p>
          </div>
        </div>

        <p className="text-gray-700 mb-4 italic">{doctor.bio}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <DetailField
            label={t("location")}
            value={doctor.location}
            icon={<MapPin className="text-red-500" />}
          />
          <DetailField
            label={t("experience")}
            value={doctor.experience}
            icon={<Briefcase className="text-orange-500" />}
          />
          <DetailField
            label={t("education")}
            value={doctor.education.split(",")[0]}
            icon={<GraduationCap className="text-purple-500" />}
          />
          <DetailField
            label={t("price")}
            value={`$${doctor.price}`}
            icon={<DollarSign className="text-green-500" />}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-teal-600" />
          {t("bookAppointmentHeader")}
        </h3>
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
          <label
            htmlFor="booking-date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("selectDate")}
          </label>
          <input
            type="date"
            id="booking-date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value)
              setSelectedAppointmentTime(null)
            }}
            className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-teal-500 focus:border-teal-500 mb-4"
          />

          <p className="block text-sm font-medium text-gray-700 mb-3">
            {t("availableTimeSlots", { date: new Date(selectedDate).toLocaleDateString() })}
          </p>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedAppointmentTime === time ? "default" : "outline"}
                onClick={() => setSelectedAppointmentTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">{t("allTimesLocal")}</p>
        </div>
      </div>

      <Button
        onClick={() => navigate("appointment-checkout-view")}
        disabled={!selectedAppointmentTime}
        size="lg"
        className="w-full font-extrabold text-lg"
      >
        {t("proceedToCheckout")}
      </Button>
    </div>
  );
}

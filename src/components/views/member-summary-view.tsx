"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { familyMembers, dailySchedule, medications, medicalRecords } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Cake,
  Droplets,
  UserCheck,
  Calendar,
  Pill,
  FolderOpen,
  Phone,
  AlertTriangle,
  Download,
} from "lucide-react";
import { DetailField } from "./detail-field";
import { Header } from "./header";

export default function MemberSummaryView() {
  const { viewingMemberId } = useAppStore();
  const { t } = useI18n();

  const member = familyMembers.find((m) => m.id === viewingMemberId);

  if (!member) {
    return <div>{t("noRecordsFound")}</div>;
  }

  // Mock data filtering for this specific member
  const memberAppointments = dailySchedule.filter(
    (item) => item.type === "Appointment" && !item.isCompleted
  ).slice(0, 1);

  const memberMeds = medications.slice(0, 2);
  const memberRecords = medicalRecords.slice(0,2);
  const memberAllergies = ["Penicillin", "Peanuts", "Shellfish"];

  const emergencyContact = {
    name: "Sarah Johnson",
    relationship: "Spouse",
    phone: "+1 (555) 123-4567",
  };

  return (
    <div className="pb-safe-footer">
      <Header
        title={`${member.name}'s Profile`}
        icon={<UserCheck />}
        backPage="family-list"
      />

      <div className="p-6 mb-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-lg flex flex-col items-center text-center">
        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
          <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold text-gray-800 mt-3">{member.name}</h2>
        <p className="text-sm font-medium text-orange-700">
          {t(member.relationship.toLowerCase() as any)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <DetailField label={t("dateOfBirth")} value={member.dob} icon={<Cake />} />
        <DetailField label={t("bloodType")} value={member.bloodType} icon={<Droplets className="text-red-500"/>} />
        <DetailField label={t("primaryDoctor")} value={t(member.primaryDoctor.replace(/\s/g, "") as any)} icon={<UserCheck />} />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-600" /> Known Allergies
        </h3>
        <div className="grid grid-cols-2 gap-2">
            {memberAllergies.map(allergy => (
                 <div key={allergy} className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-800">{allergy}</span>
                </div>
            ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-purple-600" /> Upcoming Appointments
        </h3>
        <div className="space-y-3">
          {memberAppointments.length > 0 ? (
            memberAppointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-purple-50 rounded-xl border border-purple-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-purple-800">{apt.time}</p>
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">Upcoming</span>
                </div>
                <h4 className="text-base font-bold text-gray-800 mb-1">{apt.title}</h4>
                <p className="text-sm text-gray-600">{apt.detail}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic p-4 bg-gray-50 rounded-xl">{t('noUpcomingAppointments')}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <Pill className="w-5 h-5 mr-2 text-cyan-600" /> Current Medications
        </h3>
        <div className="space-y-3">
            {memberMeds.map(med => (
                <div key={med.name} className="p-4 bg-cyan-50 rounded-xl border border-cyan-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-bold text-gray-800">{t(med.name.toLowerCase() as any)}</h4>
                       {med.stockDoses <= 7 && <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">Low Stock</span>}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{med.dosage} - {t(med.frequency.toLowerCase().replace(' ', '') as any)}</p>
                    <p className="text-xs text-gray-500">{t('prescribedBy')}: {t(med.prescribingDoctor.replace(/\s/g, '') as any)}</p>
                </div>
            ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-indigo-600" /> Recent Records
        </h3>
        <div className="space-y-2">
            {memberRecords.map(record => (
                <div key={record.date} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3">
                        <FolderOpen className="w-5 h-5 text-indigo-500" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{record.description}</p>
                            <p className="text-xs text-gray-500">{record.type} · {new Date(record.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 cursor-pointer hover:text-indigo-600"/>
                </div>
            ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-orange-600" /> {t('emergencyContact')}
        </h3>
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-base font-bold text-gray-800">{emergencyContact.name}</p>
                    <p className="text-sm text-gray-600">{emergencyContact.relationship}</p>
                    <p className="text-sm font-semibold text-primary mt-1">{emergencyContact.phone}</p>
                </div>
                <a href={`tel:${emergencyContact.phone}`} className="p-3 bg-green-600 rounded-full hover:bg-green-700 transition">
                    <Phone className="w-5 h-5 text-white"/>
                </a>
            </div>
        </div>
      </div>

    </div>
  );
}

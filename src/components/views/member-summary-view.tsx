"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
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
import { useAuth } from "@/hooks/use-auth";
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { Patient, Appointment, Medication, MedicalReport, FamilyMember } from "@/lib/types";

export default function MemberSummaryView() {
  const { viewingMemberId } = useAppStore();
  const { t } = useI18n();
  const { currentUser } = useAuth();
  const firestore = useFirestore();

  const isSelf = viewingMemberId === currentUser?.uid;

  // Determine the correct patient ID to use for fetching data
  const patientIdForDocs = useMemoFirebase(() => {
    if (isSelf) return currentUser?.uid;
    // If not self, we need to get the patientId from the familyMember document
    // This requires an additional query, which we will handle below.
    return null;
  }, [isSelf, currentUser]);
  
  const familyMemberDocRef = useMemoFirebase(() => {
    if (isSelf || !currentUser || !viewingMemberId) return null;
    return doc(firestore, 'patients', currentUser.uid, 'familyMembers', viewingMemberId);
  }, [firestore, currentUser, viewingMemberId, isSelf]);

  const { data: familyMember, isLoading: isLoadingFamilyMember } = useDoc<FamilyMember>(familyMemberDocRef);
  
  const finalPatientId = patientIdForDocs || familyMember?.patientId;

  const patientDocRef = useMemoFirebase(() => {
    if (!finalPatientId) return null;
    return doc(firestore, 'patients', finalPatientId);
  }, [firestore, finalPatientId]);

  const { data: member, isLoading: isLoadingPatient } = useDoc<Patient>(patientDocRef);

  const appointmentsQuery = useMemoFirebase(() => {
    if (!finalPatientId) return null;
    return collection(firestore, 'patients', finalPatientId, 'appointments');
  }, [firestore, finalPatientId]);

  const medicationsQuery = useMemoFirebase(() => {
    if (!finalPatientId) return null;
    return collection(firestore, 'patients', finalPatientId, 'medications');
  }, [firestore, finalPatientId]);

  const reportsQuery = useMemoFirebase(() => {
    if (!finalPatientId) return null;
    return collection(firestore, 'patients', finalPatientId, 'medicalReports');
  }, [firestore, finalPatientId]);

  const { data: memberAppointments, isLoading: isLoadingAppointments } = useCollection<Appointment>(appointmentsQuery);
  const { data: memberMeds, isLoading: isLoadingMeds } = useCollection<Medication>(medicationsQuery);
  const { data: memberRecords, isLoading: isLoadingRecords } = useCollection<MedicalReport>(reportsQuery);
  
  const isLoading = isLoadingPatient || isLoadingFamilyMember || isLoadingAppointments || isLoadingMeds || isLoadingRecords;

  if (isLoading) {
    return <div>Loading member summary...</div>;
  }
  
  if (!member) {
    return <div>{t("noRecordsFound")}</div>;
  }

  // MOCK DATA FOR NOW - To be replaced with Firestore data
  const memberAllergies = ["Penicillin", "Peanuts", "Shellfish"];
  const emergencyContact = {
    name: "Sarah Johnson",
    relationship: "Spouse",
    phone: "+1 (555) 123-4567",
  };
  const displayName = `${member.firstName} ${member.lastName}`;
  
  return (
    <div className="pb-safe-footer">
      <Header
        title={`${displayName}'s Profile`}
        icon={<UserCheck />}
        backPage="family-list"
      />

      <div className="p-6 mb-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-lg flex flex-col items-center text-center">
        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
          <AvatarFallback>{displayName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold text-gray-800 mt-3">{displayName}</h2>
        {familyMember && <p className="text-sm font-medium text-orange-700">
          {t((familyMember.relationship.toLowerCase()) as any)}
        </p>}
        {isSelf && <p className="text-sm font-medium text-orange-700">{t('relationshipSelf')}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <DetailField label={t("dateOfBirth")} value={member.dateOfBirth} icon={<Cake />} />
        <DetailField label={t("bloodType")} value={"O+"} icon={<Droplets className="text-red-500"/>} />
        <DetailField label={t("primaryDoctor")} value={"Dr. Amr Mostafa"} icon={<UserCheck />} />
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
          {memberAppointments && memberAppointments.length > 0 ? (
            memberAppointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-purple-50 rounded-xl border border-purple-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-purple-800">{new Date(apt.appointmentDateTime).toLocaleTimeString()}</p>
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">Upcoming</span>
                </div>
                <h4 className="text-base font-bold text-gray-800 mb-1">{apt.reasonForVisit}</h4>
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
            {memberMeds && memberMeds.map(med => (
                <div key={med.id} className="p-4 bg-cyan-50 rounded-xl border border-cyan-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-bold text-gray-800">{med.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{med.dosage} - {med.frequency}</p>
                </div>
            ))}
             {memberMeds?.length === 0 && <p className="text-gray-500 italic p-4 bg-gray-50 rounded-xl">No current medications.</p>}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-indigo-600" /> Recent Records
        </h3>
        <div className="space-y-2">
            {memberRecords && memberRecords.map(record => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3">
                        <FolderOpen className="w-5 h-5 text-indigo-500" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{record.reportType}</p>
                            <p className="text-xs text-gray-500">{new Date(record.reportDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 cursor-pointer hover:text-indigo-600"/>
                </div>
            ))}
            {memberRecords?.length === 0 && <p className="text-gray-500 italic p-4 bg-gray-50 rounded-xl">No recent records.</p>}
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
    
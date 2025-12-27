"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  UserCheck,
  ClipboardList,
  Siren,
  Pill,
  Paperclip,
  Download,
  Share2,
} from "lucide-react";
import { Header } from "./header";
import { DetailField } from "./detail-field";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { MedicalReport } from "@/lib/types";

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

export default function ReportDetailView() {
  const { activeReportId } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const firestore = useFirestore();

  const reportDocRef = useMemoFirebase(() => {
    if (!currentUser || !activeReportId) return null;
    return doc(firestore, 'patients', currentUser.uid, 'medicalReports', activeReportId);
  }, [firestore, currentUser, activeReportId]);

  const { data: report, isLoading } = useDoc<MedicalReport>(reportDocRef);


  if (isLoading) {
    return <div>Loading report...</div>;
  }

  if (!report) {
    return <div>{t("reportNotFound")}</div>;
  }

  const handleShare = () => {
    toast({
        title: t("sharingReport"),
    });
  }

  const handleDownload = () => {
    toast({
        title: t("downloadingFile"),
    });
  }

  return (
    <div>
      <Header
        title={report.title}
        icon={<FileText />}
        backPage="reports-list-view"
      />
      <div className="grid grid-cols-2 gap-4 mb-6">
        <DetailField
          label={t("dateOfBirth")}
          value={new Date(report.date).toLocaleDateString()}
          icon={<Calendar />}
        />
        <DetailField
          label={t("doctor")}
          value={report.doctor.split("(")[0].trim()}
          icon={<UserCheck />}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <ClipboardList className="w-6 h-6 mr-2 text-purple-600"/>{t("diagnosis")}
        </h3>
        <div className="p-4 bg-purple-50 rounded-xl shadow-inner border border-purple-200">
            <p className="text-gray-700">{report.diagnosis}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <div className="w-6 h-6 mr-2 text-red-600"><FeverIcon /></div>{t("reportedSymptoms")}
        </h3>
        <div className="p-4 bg-red-50 rounded-xl shadow-inner border border-red-200">
            <p className="text-gray-700">{report.symptoms}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <Pill className="w-6 h-6 mr-2 text-cyan-600"/>{t("treatmentPlan")}
        </h3>
        <ul className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            {report.medications.length > 0 ? report.medications.map(med => (
                <li key={med} className="flex items-start space-x-2 text-gray-700">
                    <Pill className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span>{med}</span>
                </li>
            )) : <li className="text-muted-foreground italic">{t("noMedicationsPrescribed")}</li>}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <Paperclip className="w-6 h-6 mr-2 text-indigo-600"/>{t("attachmentsLabs")}
        </h3>
        <div className="space-y-3">
            {report.attachments.length > 0 ? report.attachments.map(att => (
                 <div key={att.name} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50" onClick={handleDownload}>
                    <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{att.name}</p>
                            <p className="text-xs text-muted-foreground">{att.type}</p>
                        </div>
                    </div>
                    <Download className="w-5 h-5 text-indigo-600" />
                </div>
            )): <p className="text-muted-foreground italic p-4 bg-gray-50 rounded-xl">{t("noAttachmentsAvailable")}</p>}
        </div>
      </div>
      
      <Button onClick={handleShare} size="lg" className="w-full">
        <Share2 className="w-5 h-5 mr-2" />{t("shareReport")}
      </Button>
    </div>
  );
}

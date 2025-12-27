"use client";

import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/hooks/use-i18n";
import { Calendar, Pill, Plus } from "lucide-react";
import { Header } from "./header";
import { useToast } from "@/hooks/use-toast";

type AddScheduleFormViewProps = {
  type: "Medication" | "Appointment";
};

export default function AddScheduleFormView({
  type,
}: AddScheduleFormViewProps) {
  const { navigate } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();

  const isMedication = type === "Medication";
  const formTitle = isMedication
    ? t("addNewMedicationForm")
    : t("addNewAppointment");
  const backPage = isMedication ? "medication-manager-view" : "calendar-view";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: `${
        isMedication ? t("saveMedication") : t("saveItem")
      } ${t("success")}!`,
      description: "Your item has been added.",
    });
    navigate(backPage);
  };

  const medicationForm = (
    <>
      <Input
        placeholder={t("medicationNamePlaceholder")}
        required
        className="mb-4"
      />
      <Input placeholder={t("dosagePlaceholder")} required className="mb-4" />
      <Input placeholder={t("frequencyPlaceholder")} required className="mb-4" />
      <Input placeholder={t("prescribingDoctorLabel")} className="mb-4" />
      <Input
        type="number"
        placeholder={t("currentStockPlaceholder")}
        required
        className="mb-4"
      />
    </>
  );

  const appointmentForm = (
    <>
      <Select required>
        <SelectTrigger className="mb-4">
          <SelectValue placeholder={t("selectItemType")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Appointment">{t("appointmentType")}</SelectItem>
          <SelectItem value="Test">{t("medicalTest")}</SelectItem>
          <SelectItem value="Reminder">{t("reminder")}</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder={t("titleDescription")}
        required
        className="mb-4"
      />
      <Input type="date" required className="mb-4" />
      <Input type="time" required className="mb-4" />
      <Textarea
        placeholder={t("locationNotes")}
        rows={3}
        className="mb-4"
      />
    </>
  );

  return (
    <div>
      <Header
        title={formTitle}
        icon={isMedication ? <Pill /> : <Calendar />}
        backPage={backPage}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        {isMedication ? medicationForm : appointmentForm}

        <Button
          type="submit"
          className="w-full"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          {isMedication ? t("saveMedication") : t("saveItem")}
        </Button>
      </form>
    </div>
  );
}

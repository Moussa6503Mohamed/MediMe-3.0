"use client";

import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Shield,
  UserCheck,
} from "lucide-react";
import { Header } from "./header";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Doctor } from "@/lib/types";

export default function AppointmentCheckoutView() {
  const {
    navigate,
    activeDoctorId,
    selectedDate,
    selectedAppointmentTime,
    useSavedInsurance,
    setUseSavedInsurance,
    savedInsurance,
  } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();
  const firestore = useFirestore();

  const doctorDocRef = useMemoFirebase(() => {
    if (!activeDoctorId) return null;
    return doc(firestore, 'doctors', activeDoctorId);
  }, [firestore, activeDoctorId]);

  const { data: doctor, isLoading } = useDoc<Doctor>(doctorDocRef);


  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!doctor || !selectedAppointmentTime) {
    return <div>Error: Doctor or time slot not selected.</div>;
  }

  const consultationFee = doctor.price;
  const serviceCharge = 10;
  const tax = consultationFee * 0.05;
  const subtotal = consultationFee + serviceCharge + tax;
  const insuranceDeduction =
    useSavedInsurance && savedInsurance ? subtotal * 0.2 : 0;
  const totalDue = subtotal - insuranceDeduction;

  const handlePay = () => {
    // In a real app, this would also create an appointment document in Firestore
    toast({
      title: t("appointmentBooked"),
      description: t("youAreAllSet"),
    });
    navigate("appointment-confirmation-view");
  };

  return (
    <div>
      <Header
        title={t("appointmentCheckout")}
        icon={<CheckCircle />}
        backPage="doctor-details-view"
      />
      <div className="p-5 mb-6 bg-teal-50 rounded-2xl shadow-lg border border-teal-200">
        <p className="text-sm font-medium text-teal-700">Appointment with</p>
        <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
        <p className="text-lg font-semibold text-teal-600 mt-2">
          {new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          at {selectedAppointmentTime}
        </p>
        <p className="text-sm text-gray-500">{doctor.location}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-blue-600" />{" "}
          {t("insuranceDetails")}
        </h3>
        <div className="p-5 bg-white rounded-xl shadow-md border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="use-saved-insurance"
              className="flex items-center space-x-2 cursor-pointer text-base font-semibold text-gray-800"
            >
              <Checkbox
                id="use-saved-insurance"
                checked={useSavedInsurance}
                onCheckedChange={(checked) => setUseSavedInsurance(Boolean(checked))}
              />
              <span>{t("useSavedInsuranceLabel")}</span>
            </Label>
            <Button variant="link" className="text-sm">
              {t("changePolicy")}
            </Button>
          </div>
          {useSavedInsurance ? (
            savedInsurance ? (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm">
                <p className="font-bold text-blue-800">
                  {savedInsurance.provider}
                </p>
                <p className="text-blue-700">
                  {t("memberIdLabel")}: {savedInsurance.memberId}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                {t("noSavedInsurance")}
              </p>
            )
          ) : (
            <div className="space-y-3">
              <Input placeholder={t("insuranceProviderPlaceholder")} />
              <Input placeholder={t("memberIdPlaceholder")} />
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <DollarSign className="w-6 h-6 mr-2 text-green-600" />{" "}
          {t("pricingBreakdown")}
        </h3>
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
          <div className="flex justify-between text-sm text-gray-700">
            <p>{t("consultationFee")}</p>
            <p className="font-semibold">${consultationFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <p>{t("serviceCharge")}</p>
            <p className="font-semibold">${serviceCharge.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-sm text-gray-700 pb-2 border-b">
            <p>{t("taxLabel")}</p>
            <p className="font-semibold">${tax.toFixed(2)}</p>
          </div>
          {insuranceDeduction > 0 && (
            <div className="flex justify-between text-sm text-blue-600 pt-2">
              <p>{t("insuranceCoverageLabel")}</p>
              <p className="font-semibold">-${insuranceDeduction.toFixed(2)}</p>
            </div>
          )}
          <div className="flex justify-between text-2xl font-bold pt-3 border-t">
            <p>{t("totalDue")}</p>
            <p>${totalDue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePay}
        size="lg"
        className="w-full bg-purple-600 hover:bg-purple-700 font-extrabold text-lg"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        {t("payAndConfirm")} (${totalDue.toFixed(2)})
      </Button>
    </div>
  );
}

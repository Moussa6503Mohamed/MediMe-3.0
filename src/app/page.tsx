
"use client";

import { useAuth } from "@/hooks/use-auth";
import LoginView from "@/components/views/login-view";
import HomeView from "@/components/views/home-view";
import CreateAccountView from "@/components/views/create-account-view";
import MobileLayout from "@/components/layout/mobile-layout";
import CalendarView from "@/components/views/calendar-view";
import ScheduleDetailView from "@/components/views/schedule-detail-view";
import MedicationManagerView from "@/components/views/medication-manager-view";
import FamilyListView from "@/components/views/family-list-view";
import MemberSummaryView from "@/components/views/member-summary-view";
import DoctorBotView from "@/components/views/doctor-bot-view";
import NotificationsView from "@/components/views/notifications-view";
import ChatSummaryView from "@/components/views/chat-summary-view";
import ReportsListView from "@/components/views/reports-list-view";
import ReportDetailView from "@/components/views/report-detail-view";
import ScheduleDoctorView from "@/components/views/schedule-doctor-view";
import DoctorDetailsView from "@/components/views/doctor-details-view";
import AppointmentCheckoutView from "@/components/views/appointment-checkout-view";
import AppointmentConfirmationView from "@/components/views/appointment-confirmation-view";
import SelectLocationView from "@/components/views/select-location-view";
import RefillCartView from "@/components/views/refill-cart-view";
import SelectPharmacyView from "@/components/views/select-pharmacy-view";
import RefillCheckoutView from "@/components/views/refill-checkout-view";
import RefillConfirmationView from "@/components/views/refill-confirmation-view";
import AddMemberForm from "@/components/views/add-member-form";
import AddScheduleFormView from "@/components/views/add-schedule-form-view";
import { Toaster } from "@/components/ui/toaster";
import { useAppStore } from "@/store/app-store";
import { useEffect } from "react";
import ProfileView from "@/components/views/profile-view";
import { useI18n } from "@/hooks/use-i18n";
import { initVoiceAssistant } from "@/lib/voice";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { isLoggedIn, currentUser } = useAuth();
  const { currentPage, language } = useAppStore();
  const { t, setLanguage } = useI18n();
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    initVoiceAssistant(language, t, toast);
  }, [language, setLanguage, t, toast]);

  const renderContent = () => {
    if (!isLoggedIn) {
      if (currentPage === "create-account-view") {
        return <CreateAccountView />;
      }
      return <LoginView />;
    }

    let view;
    switch (currentPage) {
      case "home":
        view = <HomeView />;
        break;
      case "calendar-view":
        view = <CalendarView />;
        break;
      case "schedule-detail-view":
        view = <ScheduleDetailView />;
        break;
      case "medication-manager-view":
        view = <MedicationManagerView />;
        break;
      case "family-list":
        view = <FamilyListView />;
        break;
      case "member-summary-view":
        view = <MemberSummaryView />;
        break;
      case "doctor-bot":
        view = <DoctorBotView />;
        break;
      case "notifications-view":
        view = <NotificationsView />;
        break;
      case "chat-summary-view":
        view = <ChatSummaryView />;
        break;
      case "reports-list-view":
        view = <ReportsListView />;
        break;
      case "report-detail-view":
        view = <ReportDetailView />;
        break;
      case "schedule-doctor-view":
        view = <ScheduleDoctorView />;
        break;
      case "doctor-details-view":
        view = <DoctorDetailsView />;
        break;
      case "appointment-checkout-view":
        view = <AppointmentCheckoutView />;
        break;
      case "appointment-confirmation-view":
        view = <AppointmentConfirmationView />;
        break;
      case "select-location-view":
        view = <SelectLocationView />;
        break;
      case "refill-cart-view":
        view = <RefillCartView />;
        break;
      case "select-pharmacy-view":
        view = <SelectPharmacyView />;
        break;
      case "refill-checkout-view":
        view = <RefillCheckoutView />;
        break;
      case "refill-confirmation-view":
        view = <RefillConfirmationView />;
        break;
      case "add-member-form":
        view = <AddMemberForm />;
        break;
      case "add-medication-form":
        view = <AddScheduleFormView type="Medication" />;
        break;
      case "add-appointment-form":
        view = <AddScheduleFormView type="Appointment" />;
        break;
      case "profile-view":
        view = <ProfileView />;
        break;
      default:
        view = <HomeView />;
    }
    return <MobileLayout>{view}</MobileLayout>;
  };

  return (
    <main className="bg-gray-100 font-inter h-screen flex justify-center py-4 md:py-0">
      <div
        id="app-root"
        className="w-full max-w-md bg-white shadow-2xl md:rounded-3xl p-4 sm:p-6 border border-gray-50 overflow-y-auto relative"
      >
        {renderContent()}
        <Toaster />
      </div>
    </main>
  );
}

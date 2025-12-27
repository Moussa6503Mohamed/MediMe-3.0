"use client";
import React from "react";
import FooterNav from "./footer-nav";
import VoiceAssistantOverlay from "./voice-assistant-overlay";
import { useAppStore } from "@/store/app-store";

const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentPage } = useAppStore();

  const showFooter = ![
    "schedule-detail-view",
    "refill-cart-view",
    "select-pharmacy-view",
    "refill-checkout-view",
    "refill-confirmation-view",
    "doctor-details-view",
    "appointment-checkout-view",
    "appointment-confirmation-view",
    "select-location-view",
    "add-member-form",
    "add-medication-form",
    "add-appointment-form",
    "doctor-bot"
  ].includes(currentPage);


  return (
    <>
      <div className="pb-safe-footer h-full overflow-y-auto">
        {children}
      </div>
      {showFooter && (
        <div className="w-full fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4">
          <FooterNav />
        </div>
      )}
      <VoiceAssistantOverlay />
    </>
  );
};

export default MobileLayout;

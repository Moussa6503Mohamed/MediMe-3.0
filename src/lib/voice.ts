
"use client";

import type { Toast } from "@/hooks/use-toast";
import { AppStore, useAppStore } from "@/store/app-store";

let voiceRecognition: SpeechRecognition | null = null;
let toast: ({ ...props }: Toast) => any;
let navigate: AppStore["navigate"];
let setLastVoiceCommand: AppStore["setLastVoiceCommand"];
let getStoreState: () => AppStore;


export const initVoiceAssistant = (
  language: "en" | "ar",
  t: (key: string, params?: Record<string, string | number>) => string,
  toastFn: typeof toast,
  navigateFn: typeof navigate,
  setLastVoiceCommandFn: typeof setLastVoiceCommand,
  getStoreStateFn: () => AppStore
) => {
  toast = toastFn;
  navigate = navigateFn;
  setLastVoiceCommand = setLastVoiceCommandFn;
  getStoreState = getStoreStateFn;

  if (typeof window !== "undefined") {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      voiceRecognition = new SpeechRecognition();
      voiceRecognition.continuous = false;
      voiceRecognition.interimResults = false;
      voiceRecognition.lang = language === "ar" ? "ar-EG" : "en-US";

      voiceRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        toast({ title: `Command: "${transcript}"` });
        handleVoiceCommand(transcript, t);
      };

      voiceRecognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "no-speech") {
          toast({
            title: t("noSpeechDetected"),
            variant: "destructive",
          });
        } else if (event.error === "not-allowed") {
          toast({
            title: t("microphoneAccessDenied"),
            variant: "destructive",
          });
        } else {
          toast({
            title: `${t("voiceError")}: ${event.error}`,
            variant: "destructive",
          });
        }
        // Ensure the assistant stops on error
        getStoreState().stopVoiceAssistant();
      };

      voiceRecognition.onend = () => {
        // Stop the assistant UI when recognition ends
        getStoreState().stopVoiceAssistant();
      };
    }
  }
};

export const startVoiceAssistant = (
  isVoiceAssistantActive: boolean,
  start: () => void,
  stop: () => void,
  t: (key: string) => string
) => {
  if (!voiceRecognition) {
    toast({
      title: t("voiceNotSupported"),
      variant: "destructive",
    });
    return;
  }
  if (isVoiceAssistantActive) {
    voiceRecognition.stop();
    stop();
  } else {
    voiceRecognition.start();
    start();
  }
};

const handleVoiceCommand = (
  command: string,
  t: (key: string, params?: Record<string, string | number>) => string
) => {
  const lowerCommand = command.toLowerCase();
  const { currentPage } = getStoreState();

  // Command for DoctorBot
  if (currentPage === 'doctor-bot') {
    if (lowerCommand.includes('exit') || lowerCommand.includes('go back')) {
        toast({ title: t("navigatingDashboard") });
        navigate("home");
    } else {
        setLastVoiceCommand(command);
    }
    return;
  }

  // General navigation commands
  if (lowerCommand.includes("go home") || lowerCommand.includes("dashboard")) {
    toast({ title: t("navigatingDashboard") });
    navigate("home");
  } else if (
    lowerCommand.includes("schedule") ||
    lowerCommand.includes("calendar")
  ) {
    toast({ title: t("openingSchedule") });
    navigate("calendar-view");
  } else if (lowerCommand.includes("medication")) {
    toast({ title: t("accessingMedications") });
    navigate("medication-manager-view");
  } else if (lowerCommand.includes("family") || lowerCommand.includes("members")) {
    toast({ title: t('navigatingTo', { page: t('family')})});
    navigate("family-list");
  } else if (lowerCommand.includes("report")) {
    toast({ title: t('navigatingTo', { page: t('myReports')})});
    navigate("reports-list-view");
  } else if (lowerCommand.includes("doctor bot") || lowerCommand.includes("ai chat")) {
    toast({ title: t("openingDoctorBot") });
    navigate("doctor-bot");
  } else if (lowerCommand.includes("add member")) {
    toast({ title: t("openingAddMemberForm") });
    navigate("add-member-form");
  } else {
    toast({
      title: t("commandNotUnderstood"),
      description: t("tryGoHomeOrShowSchedule"),
      variant: "destructive",
    });
  }
};

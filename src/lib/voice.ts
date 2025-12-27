"use client";

import { useToast } from "@/hooks/use-toast";
import { AppStore } from "@/store/app-store";

let voiceRecognition: SpeechRecognition | null = null;
const { toast } = useToast();

export const initVoiceAssistant = (
  language: "en" | "ar",
  t: (key: string) => string
) => {
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
        // handleVoiceCommand(transcript, useAppStore.getState().navigate, t);
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
  navigate: AppStore["navigate"],
  t: (key: string) => string
) => {
  const lowerCommand = command.toLowerCase();

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
  } else if (lowerCommand.includes("doctor bot")) {
    toast({ title: t("openingDoctorBot") });
    navigate("doctor-bot");
  } else {
    toast({
      title: t("commandNotUnderstood"),
      description: t("tryGoHomeOrShowSchedule"),
      variant: "destructive",
    });
  }
};

"use server";

import {
  aiDoctorBotSymptomCheck,
  type AIDoctorBotSymptomCheckInput,
} from "@/ai/flows/ai-doctor-bot-symptom-check";

export async function runAiDoctorBot(input: AIDoctorBotSymptomCheckInput) {
  try {
    const result = await aiDoctorBotSymptomCheck(input);
    return result;
  } catch (error) {
    console.error("AI DoctorBot Error:", error);
    // Ensure a consistent output structure on error
    return {
      guidance:
        "I'm sorry, but I encountered an error and can't provide guidance at the moment. Please try again later.",
      disclaimer:
        "This information is not a substitute for professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment.",
    };
  }
}

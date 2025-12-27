'use server';
/**
 * @fileOverview An AI DoctorBot that helps patients check their symptoms and receive potential health guidance.
 *
 * - aiDoctorBotSymptomCheck - A function that handles the symptom checking process.
 * - AIDoctorBotSymptomCheckInput - The input type for the aiDoctorBotSymptomCheck function.
 * - AIDoctorBotSymptomCheckOutput - The return type for the aiDoctorBotSymptomCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDoctorBotSymptomCheckInputSchema = z.object({
  symptoms: z.string().describe('The symptoms the patient is experiencing.'),
  patientInfo: z.string().optional().describe('Additional information about the patient, such as age, sex, and medical history.'),
});
export type AIDoctorBotSymptomCheckInput = z.infer<typeof AIDoctorBotSymptomCheckInputSchema>;

const AIDoctorBotSymptomCheckOutputSchema = z.object({
  guidance: z.string().describe('Potential health guidance and recommendations based on the symptoms.'),
  disclaimer: z.string().describe('A disclaimer that the information provided is not a substitute for professional medical advice.'),
});
export type AIDoctorBotSymptomCheckOutput = z.infer<typeof AIDoctorBotSymptomCheckOutputSchema>;

export async function aiDoctorBotSymptomCheck(input: AIDoctorBotSymptomCheckInput): Promise<AIDoctorBotSymptomCheckOutput> {
  return aiDoctorBotSymptomCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDoctorBotSymptomCheckPrompt',
  input: {schema: AIDoctorBotSymptomCheckInputSchema},
  output: {schema: AIDoctorBotSymptomCheckOutputSchema},
  prompt: `You are an AI DoctorBot designed to help patients understand their health concerns.

  Based on the symptoms provided, offer potential health guidance and recommendations. Include a disclaimer that the information provided is not a substitute for professional medical advice.

  Symptoms: {{{symptoms}}}
  Patient Information: {{{patientInfo}}}

  Disclaimer: This information is not a substitute for professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment.
  `,
});

const aiDoctorBotSymptomCheckFlow = ai.defineFlow(
  {
    name: 'aiDoctorBotSymptomCheckFlow',
    inputSchema: AIDoctorBotSymptomCheckInputSchema,
    outputSchema: AIDoctorBotSymptomCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

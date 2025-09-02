
'use server';
/**
 * @fileOverview A flow that provides a conversational AI doctor to chat with the user about their health data.
 *
 * - chatWithDoctor - A function that handles the conversation.
 * - ChatWithDoctorInput - The input type for the chatWithDoctor function.
 * - ChatWithDoctorOutput - The return type for the chatWithDoctor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ChatMessage, HealthData } from '@/lib/types';
import { ChatMessageSchema, HealthDataSchema } from '@/lib/types';

const ChatWithDoctorInputSchema = z.object({
  healthData: HealthDataSchema.describe("A summary of the user's latest health data."),
  messages: z.array(ChatMessageSchema).describe('The history of the conversation so far.'),
});
export type ChatWithDoctorInput = z.infer<typeof ChatWithDoctorInputSchema>;

const ChatWithDoctorOutputSchema = z.object({
  reply: z.string().describe("The doctor's response to the user's message."),
});
export type ChatWithDoctorOutput = z.infer<typeof ChatWithDoctorOutputSchema>;

export async function chatWithDoctor(
  input: ChatWithDoctorInput
): Promise<ChatWithDoctorOutput> {
  return chatWithDoctorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithDoctorPrompt',
  input: {schema: ChatWithDoctorInputSchema},
  output: {schema: ChatWithDoctorOutputSchema},
  prompt: `You are an empathetic and knowledgeable AI doctor specializing in chronic respiratory conditions. Your role is to act as a virtual health assistant.

  IMPORTANT: You are not a real doctor and cannot provide a real diagnosis or prescribe medication. You MUST include a disclaimer in your first response that you are an AI assistant and the user should always consult a real healthcare professional for medical advice.

  Here is a summary of the patient's current health data. Use this as the primary context for your conversation.
  - Exacerbation Risk Score: {{{healthData.riskScore}}}
  - Overnight Cough Frequency: {{{healthData.coughFrequency}}} per hour
  - Wheezing Detected Overnight: {{{healthData.wheezingDetected}}}
  - Average Breathing Rate: {{{healthData.breathingRate}}} bpm
  - Current AQI: {{{healthData.aqi}}}
  - Current Pollen Count: {{{healthData.pollenCount}}}
  - Last Sleep Quality Score: {{{healthData.sleepQualityScore}}}

  Your tasks are:
  1.  Analyze the provided health data to understand the user's current condition.
  2.  Engage in a supportive and conversational manner.
  3.  Answer the user's questions based on their data.
  4.  Provide personalized, actionable advice on diet, lifestyle, and self-care to help them manage their condition. For example, if AQI is high, suggest indoor activities. If sleep is poor, suggest relaxation techniques.
  5.  Maintain the context of the conversation.

  Conversation History:
  {{#each messages}}
    {{{this.role}}}: {{{this.content}}}
  {{/each}}
  
  Based on the health data and the conversation history, provide a helpful and encouraging response to the latest user message. Your role is "model".
  `,
});

const chatWithDoctorFlow = ai.defineFlow(
  {
    name: 'chatWithDoctorFlow',
    inputSchema: ChatWithDoctorInputSchema,
    outputSchema: ChatWithDoctorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

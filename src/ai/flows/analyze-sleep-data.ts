
'use server';
/**
 * @fileOverview A flow that uses generative AI to analyze a user's sleep data from overnight acoustic monitoring.
 *
 * - analyzeSleepData - A function that analyzes sleep data.
 * - AnalyzeSleepDataInput - The input type for the analyzeSleepData function.
 * - AnalyzeSleepDataOutput - The return type for the analyzeSleepData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSleepDataInputSchema = z.object({
  nightlyAcousticData: z.string().describe('A JSON string representing the acoustic data collected overnight. It must include cough frequency (coughFrequency), whether wheezing was detected (wheezing), and average breathing rate (breathingRate).'),
});
export type AnalyzeSleepDataInput = z.infer<typeof AnalyzeSleepDataInputSchema>;

const AnalyzeSleepDataOutputSchema = z.object({
  sleepScore: z.number().min(0).max(100).describe('A score from 0 to 100 representing the quality of sleep, based on respiratory events.'),
  nightInsight: z.string().describe('A summary of the night, highlighting key events and potential disturbances.'),
});
export type AnalyzeSleepDataOutput = z.infer<typeof AnalyzeSleepDataOutputSchema>;

export async function analyzeSleepData(
  input: AnalyzeSleepDataInput
): Promise<AnalyzeSleepDataOutput> {
  return analyzeSleepDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSleepDataPrompt',
  input: {schema: AnalyzeSleepDataInputSchema},
  output: {schema: AnalyzeSleepDataOutputSchema},
  prompt: `You are a sleep analysis AI. Your task is to analyze the provided overnight acoustic data and generate a sleep quality score (out of 100) and a concise "Night Insight" summary.

  Here is the data for analysis:
  {{{nightlyAcousticData}}}

  Calculate the total sleep score by summing the component scores based on the following exact logic:

  1. Cough Frequency Score (Max: 40 points) based on coughs per hour:
     - 40 points: if 0 <= coughs <= 5
     - 30 points: if 5 < coughs <= 10
     - 20 points: if 10 < coughs <= 20
     - 10 points: if 20 < coughs <= 30
     - 0 points: if coughs > 30

  2. Wheeze Detection Score (Max: 30 points):
     - 30 points: if wheezing is not detected
     - 0 points: if wheezing is detected

  3. Breathing Rate Score (Max: 30 points) based on breaths per minute (bpm):
     - 30 points: if 12 <= bpm <= 16
     - 20 points: if (10 <= bpm < 12) or (16 < bpm <= 18)
     - 10 points: if (8 <= bpm < 10) or (18 < bpm <= 20)
     - 0 points: if bpm < 8 or bpm > 20

  The final sleep score is the sum of these three component scores.

  The Night Insight should be a brief, easy-to-read summary of the night's events, mentioning the key data points that influenced the score.
  `,
});

const analyzeSleepDataFlow = ai.defineFlow(
  {
    name: 'analyzeSleepDataFlow',
    inputSchema: AnalyzeSleepDataInputSchema,
    outputSchema: AnalyzeSleepDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


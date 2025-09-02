
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
  nightlyAcousticData: z.string().describe('A JSON string representing the acoustic data collected overnight. It must include average breathing rate (μ_BR), breathing rate stability (σ_BR), coughs per hour (CPH), percentage of sleep with wheezing (P_Wheeze), and significant non-respiratory audio events per hour (EPH).'),
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
  prompt: `You are a sleep analysis AI. Your task is to analyze the provided overnight acoustic data and generate a sleep quality score and a concise "Night Insight" summary.

  Here is the data for analysis:
  {{{nightlyAcousticData}}}

  Calculate the total sleep score (out of 100) by summing the component scores based on the following exact logic:

  1. Breathing Rate Score (S_BR) (Max: 40 points) = S_BR_rate + S_BR_stability
     a. Rate Score (S_BR_rate) (Max: 25 points) from average breathing rate (μ_BR):
        - 25 points: if 12 <= μ_BR <= 20
        - 15 points: if (10 <= μ_BR < 12) or (20 < μ_BR <= 22)
        - 5 points: if (8 <= μ_BR < 10) or (22 < μ_BR <= 25)
        - 0 points: if μ_BR < 8 or μ_BR > 25
     b. Stability Score (S_BR_stability) (Max: 15 points) from breathing rate stability (σ_BR):
        - 15 points: if σ_BR <= 2
        - 10 points: if 2 < σ_BR <= 4
        - 5 points: if 4 < σ_BR <= 6
        - 0 points: if σ_BR > 6

  2. Cough Frequency Score (S_Cough) (Max: 20 points) from coughs per hour (CPH):
     - 20 points: if CPH = 0
     - 15 points: if 0 < CPH <= 2
     - 10 points: if 2 < CPH <= 5
     - 5 points: if 5 < CPH <= 10
     - 0 points: if CPH > 10

  3. Wheeze Detection Score (S_Wheeze) (Max: 20 points) from percentage of sleep time with wheezing (P_Wheeze):
     - 20 points: if P_Wheeze = 0%
     - 15 points: if 0% < P_Wheeze <= 5%
     - 10 points: if 5% < P_Wheeze <= 15%
     - 5 points: if 15% < P_Wheeze <= 30%
     - 0 points: if P_Wheeze > 30%

  4. Audio Disturbance Score (S_Disturb) (Max: 20 points) from non-respiratory audio events per hour (EPH):
     - 20 points: if EPH <= 1
     - 15 points: if 1 < EPH <= 5
     - 10 points: if 5 < EPH <= 10
     - 5 points: if 10 < EPH <= 20
     - 0 points: if EPH > 20

  The final sleep score is the sum of these four component scores.

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

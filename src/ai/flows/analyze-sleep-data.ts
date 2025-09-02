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
  nightlyAcousticData: z.string().describe('A JSON string representing the acoustic data collected overnight, including cough frequency, wheezing incidents, and average breathing rate.'),
});
export type AnalyzeSleepDataInput = z.infer<typeof AnalyzeSleepDataInputSchema>;

const AnalyzeSleepDataOutputSchema = z.object({
  sleepScore: z.number().describe('A score from 0 to 100 representing the quality of sleep, based on respiratory events.'),
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

  The sleep score should be a single number between 0 and 100, where 100 is perfect, undisturbed sleep. Base the score on the frequency of coughs and the presence of wheezing. Lower scores should reflect more frequent disturbances.

  The Night Insight should be a brief, easy-to-read summary of the night's respiratory events.

  Here is the data for analysis:
  {{{nightlyAcousticData}}}

  Based on this data, provide a sleep score and a night insight.
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

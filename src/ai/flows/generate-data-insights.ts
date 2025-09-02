'use server';

/**
 * @fileOverview A flow that uses generative AI to provide users with overall trends and useful insights from their collected data.
 *
 * - generateDataInsights - A function that generates data insights for the user.
 * - GenerateDataInsightsInput - The input type for the generateDataInsights function.
 * - GenerateDataInsightsOutput - The return type for the generateDataInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDataInsightsInputSchema = z.object({
  acousticData: z.string().describe('Historical acoustic data of the user.'),
  environmentalFactors: z
    .string()
    .describe('Historical environmental factors data of the user.'),
  riskScores: z.string().describe('Historical risk scores of the user.'),
});
export type GenerateDataInsightsInput = z.infer<
  typeof GenerateDataInsightsInputSchema
>;

const GenerateDataInsightsOutputSchema = z.object({
  insights: z.string().describe('Generated insights from the collected data.'),
});
export type GenerateDataInsightsOutput = z.infer<
  typeof GenerateDataInsightsOutputSchema
>;

export async function generateDataInsights(
  input: GenerateDataInsightsInput
): Promise<GenerateDataInsightsOutput> {
  return generateDataInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDataInsightsPrompt',
  input: {schema: GenerateDataInsightsInputSchema},
  output: {schema: GenerateDataInsightsOutputSchema},
  prompt: `You are an AI assistant that analyzes user data to provide useful insights.

  Analyze the following data and generate insights:

  Acoustic Data: {{{acousticData}}}
  Environmental Factors: {{{environmentalFactors}}}
  Risk Scores: {{{riskScores}}}

  Provide overall trends and useful insights from the collected data so the user can better understand their condition and discuss it with their doctor.
  Do not make any diagnosis or medical recommendations. Only provide data insights.
  Be concise and easy to understand.
  `,
});

const generateDataInsightsFlow = ai.defineFlow(
  {
    name: 'generateDataInsightsFlow',
    inputSchema: GenerateDataInsightsInputSchema,
    outputSchema: GenerateDataInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

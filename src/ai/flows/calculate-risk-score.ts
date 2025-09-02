'use server';
/**
 * @fileOverview A flow that uses generative AI to calculate a user's exacerbation risk score.
 *
 * - calculateRiskScore - A function that calculates the risk score.
 * - CalculateRiskScoreInput - The input type for the function.
 * - CalculateRiskScoreOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateRiskScoreInputSchema = z.object({
  symptomLogs: z.string().describe("A JSON string representing the user's recent symptom logs (phlegm color, inhaler usage)."),
  acousticData: z.string().describe("A JSON string of recent acoustic data (cough frequency, wheezing)."),
  environmentalData: z.string().describe("A JSON string of recent environmental data (AQI, pollen)."),
});
export type CalculateRiskScoreInput = z.infer<typeof CalculateRiskScoreInputSchema>;

const CalculateRiskScoreOutputSchema = z.object({
  riskScore: z.number().min(0).max(100).describe('The calculated exacerbation risk score, from 0 to 100.'),
  explanation: z.string().describe('A brief explanation of the key factors that contributed to the new risk score.'),
});
export type CalculateRiskScoreOutput = z.infer<typeof CalculateRiskScoreOutputSchema>;

export async function calculateRiskScore(
  input: CalculateRiskScoreInput
): Promise<CalculateRiskScoreOutput> {
  return calculateRiskScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateRiskScorePrompt',
  input: {schema: CalculateRiskScoreInputSchema},
  output: {schema: CalculateRiskScoreOutputSchema},
  prompt: `You are a health data analyst AI. Your task is to calculate an exacerbation risk score for a user with a chronic respiratory condition based on the data provided.

  Analyze the following data:
  - Recent Symptom Logs: {{{symptomLogs}}}
  - Recent Acoustic Data: {{{acousticData}}}
  - Recent Environmental Data: {{{environmentalData}}}

  Based on this data, calculate a risk score from 0 (lowest risk) to 100 (highest risk).
  - Higher risk should be associated with: green/yellow phlegm, increased inhaler usage, high cough frequency, presence of wheezing, and poor environmental conditions (high AQI/pollen).
  - Lower risk should be associated with: clear/white phlegm, low inhaler usage, low cough frequency, no wheezing, and good environmental conditions.

  Also, provide a brief, one or two-sentence explanation summarizing the main reasons for the calculated score. For example, "The score increased due to recent reports of yellow phlegm and a rise in local air quality index."

  Return the new score and the explanation.
  `,
});

const calculateRiskScoreFlow = ai.defineFlow(
  {
    name: 'calculateRiskScoreFlow',
    inputSchema: CalculateRiskScoreInputSchema,
    outputSchema: CalculateRiskScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

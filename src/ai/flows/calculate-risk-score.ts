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
  prompt: `You are a health data analyst AI. Your task is to calculate an exacerbation risk score for a user with a chronic respiratory condition based on their symptom logs.

  Analyze the following data:
  - Recent Symptom Logs: {{{symptomLogs}}}

  Calculate a risk score from 0 (lowest risk) to 100 (highest risk) based on these rules:

  Phlegm Color Severity:
  - 'Clear': fine (score contribution: 0-10)
  - 'White': ok (score contribution: 10-25)
  - 'Yellow': moderate (score contribution: 25-50)
  - 'Green', 'Other': danger (score contribution: 50-70)

  Inhaler Usage Severity:
  - 0: fine (score contribution: 0-5)
  - 1: ok (score contribution: 5-15)
  - 2: moderate (score contribution: 15-30)
  - >2: danger (score contribution: 30-50)

  The final risk score should be a combination of the severity of both phlegm color and inhaler usage from the most recent logs. A user with 'Green' phlegm and high inhaler usage should have a very high score. A user with 'Clear' phlegm and no inhaler usage should have a very low score.

  Provide a brief, one or two-sentence explanation summarizing the main reasons for the calculated score based on the reported symptoms. For example, "The score is elevated due to recent reports of yellow phlegm and increased inhaler usage."

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

'use server';
/**
 * @fileOverview A flow that uses generative AI to predict future exacerbation risk.
 *
 * - predictFutureRisk - A function that predicts future risk.
 * - PredictFutureRiskInput - The input type for the function.
 * - PredictFutureRiskOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFutureRiskInputSchema = z.object({
  historicalRiskScores: z.string().describe("A JSON string representing the user's recent historical risk scores."),
  environmentalForecast: z.string().describe("A JSON string representing the environmental forecast for the next 24-48 hours (weather, pollen, AQI)."),
});
export type PredictFutureRiskInput = z.infer<typeof PredictFutureRiskInputSchema>;

const PredictFutureRiskOutputSchema = z.object({
  predictedRiskScore: z.number().min(0).max(100).describe('The predicted exacerbation risk score for the next 24-48 hours.'),
  proactiveAlert: z.string().describe('A personalized, actionable alert message based on the prediction.'),
});
export type PredictFutureRiskOutput = z.infer<typeof PredictFutureRiskOutputSchema>;

export async function predictFutureRisk(
  input: PredictFutureRiskInput
): Promise<PredictFutureRiskOutput> {
  return predictFutureRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictFutureRiskPrompt',
  input: {schema: PredictFutureRiskInputSchema},
  output: {schema: PredictFutureRiskOutputSchema},
  prompt: `You are a predictive health AI specializing in respiratory conditions. Your task is to forecast a user's exacerbation risk for the next 24-48 hours.

  Analyze the following data:
  - Historical Risk Scores: {{{historicalRiskScores}}}
  - Environmental Forecast: {{{environmentalForecast}}}

  Based on the user's risk score trend and the upcoming environmental conditions, predict a new risk score.

  Then, generate a concise, personalized, and proactive alert. The tone should be helpful and encouraging.
  - If the predicted risk is high due to environmental factors, the alert should mention the specific trigger and suggest concrete actions. For example: "High pollen is forecasted tomorrow. Remember to take your controller medication and consider staying indoors."
  - If the risk is low, provide a reassuring message, like: "The forecast looks good for the next couple of days. Continue your current routine and enjoy the clear air!"

  Return the predicted score and the alert message.
  `,
});

const predictFutureRiskFlow = ai.defineFlow(
  {
    name: 'predictFutureRiskFlow',
    inputSchema: PredictFutureRiskInputSchema,
    outputSchema: PredictFutureRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

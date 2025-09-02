// src/ai/flows/personalized-action-recommendations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending personalized actions based on a user's exacerbation risk score and trends in their data.
 *
 * The flow uses a prompt to generate action recommendations based on the input data.
 * It exports the PersonalizedActionRecommendations function, the PersonalizedActionRecommendationsInput type, and the PersonalizedActionRecommendationsOutput type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedActionRecommendationsInputSchema = z.object({
  exacerbationRiskScore: z.number().describe('The user\'s current exacerbation risk score.'),
  acousticDataTrends: z.string().describe('Trends in the user\'s acoustic data (cough frequency, wheezing, breathing rate).'),
  environmentalFactors: z.string().describe('Real-time environmental data (AQI, pollen) for the user\'s location.'),
  symptomData: z.string().describe('User-logged symptom data (phlegm color, inhaler usage).'),
});
export type PersonalizedActionRecommendationsInput = z.infer<typeof PersonalizedActionRecommendationsInputSchema>;

const PersonalizedActionRecommendationsOutputSchema = z.object({
  recommendedActions: z.string().describe('A list of personalized actions recommended for the user (e.g., increase medication dosage, use rescue inhaler).'),
});
export type PersonalizedActionRecommendationsOutput = z.infer<typeof PersonalizedActionRecommendationsOutputSchema>;

export async function personalizedActionRecommendations(
  input: PersonalizedActionRecommendationsInput
): Promise<PersonalizedActionRecommendationsOutput> {
  return personalizedActionRecommendationsFlow(input);
}

const personalizedActionRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedActionRecommendationsPrompt',
  input: {schema: PersonalizedActionRecommendationsInputSchema},
  output: {schema: PersonalizedActionRecommendationsOutputSchema},
  prompt: `You are an AI assistant specialized in providing personalized action recommendations for respiratory disease management.

  Based on the user's current exacerbation risk score and trends in their personal data, provide a list of specific and actionable recommendations.

  Exacerbation Risk Score: {{{exacerbationRiskScore}}}
  Acoustic Data Trends: {{{acousticDataTrends}}}
  Environmental Factors: {{{environmentalFactors}}}
  Symptom Data: {{{symptomData}}}

  Consider the following when formulating your recommendations:
  - The user's recent trends in acoustic data, environmental factors, and symptom data.
  - The potential impact of environmental factors on the user's respiratory health.
  - The user's adherence to their medication regimen.

  Provide recommendations that are clear, concise, and easy to follow. If the risk score is low, suggest maintaining current practices. If the risk score is high, suggest concrete steps to mitigate potential exacerbations.

  Output a string of recommended actions.
  `,
});

const personalizedActionRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedActionRecommendationsFlow',
    inputSchema: PersonalizedActionRecommendationsInputSchema,
    outputSchema: PersonalizedActionRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedActionRecommendationsPrompt(input);
    return output!;
  }
);

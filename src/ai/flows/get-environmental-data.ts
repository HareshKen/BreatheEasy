'use server';
/**
 * @fileOverview A flow that uses generative AI to fetch simulated real-time environmental data.
 *
 * - getEnvironmentalData - A function that fetches environmental data.
 * - GetEnvironmentalDataInput - The input type for the function.
 * - GetEnvironmentalDataOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getCurrentWeather } from '../tools/weather';

const GetEnvironmentalDataInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type GetEnvironmentalDataInput = z.infer<typeof GetEnvironmentalDataInputSchema>;

const GetEnvironmentalDataOutputSchema = z.object({
  aqi: z.number().describe('The Air Quality Index (AQI) value.'),
  pollen: z.enum(['Low', 'Moderate', 'High']).describe('The pollen count level.'),
  locationName: z.string().describe('The name of the location.'),
});
export type GetEnvironmentalDataOutput = z.infer<typeof GetEnvironmentalDataOutputSchema>;

export async function getEnvironmentalData(
  input: GetEnvironmentalDataInput
): Promise<GetEnvironmentalDataOutput> {
  return getEnvironmentalDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getEnvironmentalDataPrompt',
  input: {schema: GetEnvironmentalDataInputSchema},
  output: {schema: GetEnvironmentalDataOutputSchema},
  tools: [getCurrentWeather],
  prompt: `You are a weather and air quality API. Based on the provided latitude ({{{latitude}}}) and longitude ({{{longitude}}}), use the available tools to return a realistic Air Quality Index (AQI) value, a pollen count level ('Low', 'Moderate', or 'High'), and a plausible city name for that location.

  Do not mention that you are an AI or that this is simulated. Act as a real data provider.
  `,
});

const getEnvironmentalDataFlow = ai.defineFlow(
  {
    name: 'getEnvironmentalDataFlow',
    inputSchema: GetEnvironmentalDataInputSchema,
    outputSchema: GetEnvironmentalDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

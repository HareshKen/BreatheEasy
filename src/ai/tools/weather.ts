'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Mock function to simulate fetching weather data.
// In a real application, this would call a weather API.
export const fetchWeatherData = async (latitude: number, longitude: number) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate data based on a mock location
  // A real implementation would use reverse geocoding.
  const mockLocation = "Palo Alto, CA";

  // Simulate AQI and Pollen data
  const aqi = Math.floor(Math.random() * 50) + 1; // Good AQI
  const pollenLevels = ['Low', 'Moderate', 'High'];
  const pollen = pollenLevels[Math.floor(Math.random() * pollenLevels.length)] as 'Low' | 'Moderate' | 'High';

  return {
    locationName: mockLocation,
    aqi,
    pollen,
  };
};

export const getCurrentWeather = ai.defineTool(
  {
    name: 'getCurrentWeather',
    description: 'Returns the current weather, AQI, and pollen count for a given location.',
    inputSchema: z.object({
      latitude: z.number().describe('The latitude of the location.'),
      longitude: z.number().describe('The longitude of the location.'),
    }),
    outputSchema: z.object({
        locationName: z.string().describe('The name of the location.'),
        aqi: z.number().describe('The Air Quality Index (AQI) value.'),
        pollen: z.enum(['Low', 'Moderate', 'High']).describe('The pollen count level.'),
    }),
  },
  async (input) => {
    return await fetchWeatherData(input.latitude, input.longitude);
  }
);

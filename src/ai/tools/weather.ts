
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
  const mockLocation = "Chennai, India";

  // Simulate AQI and Pollen data
  const aqi = Math.floor(Math.random() * 100) + 1; // AQI up to 100
  const pollenLevels = ['Low', 'Moderate', 'High'];
  const pollen = pollenLevels[Math.floor(Math.random() * pollenLevels.length)] as 'Low' | 'Moderate' | 'High';
  const temperature = Math.floor(Math.random() * 10) + 25; // 25-34 C
  const humidity = Math.floor(Math.random() * 30) + 60; // 60-89%
  
  // Simulate pollutant data
  const pm25 = Math.floor(Math.random() * 40); // 0-40 ug/m3
  const ozone = Math.floor(Math.random() * 60); // 0-60 ppb
  const so2 = Math.floor(Math.random() * 10); // 0-10 ppb
  const no2 = Math.floor(Math.random() * 20); // 0-20 ppb

  return {
    locationName: mockLocation,
    aqi,
    pollen,
    temperature,
    humidity,
    pm25,
    ozone,
    so2,
    no2,
  };
};

export const getCurrentWeather = ai.defineTool(
  {
    name: 'getCurrentWeather',
    description: 'Returns the current weather, AQI, pollen count, and specific pollutant levels for a given location.',
    inputSchema: z.object({
      latitude: z.number().describe('The latitude of the location.'),
      longitude: z.number().describe('The longitude of the location.'),
    }),
    outputSchema: z.object({
        locationName: z.string().describe('The name of the location.'),
        aqi: z.number().describe('The overall Air Quality Index (AQI) value.'),
        pollen: z.enum(['Low', 'Moderate', 'High']).describe('The pollen count level.'),
        temperature: z.number().describe('The current temperature in Celsius.'),
        humidity: z.number().describe('The current humidity percentage.'),
        pm25: z.number().describe('The PM2.5 particulate matter level.'),
        ozone: z.number().describe('The Ozone (O3) level.'),
        so2: z.number().describe('The Sulfur Dioxide (SO2) level.'),
        no2: z.number().describe('The Nitrogen Dioxide (NO2) level.'),
    }),
  },
  async (input) => {
    return await fetchWeatherData(input.latitude, input.longitude);
  }
);


import { z } from 'zod';

export interface RiskScoreHistory {
  date: string;
  score: number;
}

export interface AcousticData {
  date?: string;
  coughFrequency: number;
  wheezing: boolean;
  breathingRate: number;
}

export interface EnvironmentalData {
  date?: string;
  location: string;
  aqi: number;
  pollen: 'Low' | 'Moderate' | 'High';
  temperature: number;
  humidity: number;
}

export interface DailyData {
  date: string;
  riskScore: number;
  coughFrequency?: number;
  aqi?: number;
}

export interface SymptomLog {
    dateTime: Date;
    phlegmColor: 'Clear' | 'White' | 'Yellow' | 'Green' | 'Other';
    inhalerUsage: number;
}

export interface AnalyzeCoughOutput {
  coughType: 'Productive' | 'Non-productive' | 'Uncertain';
  characteristics: string;
  summary: string;
}

export interface SleepReport {
  sleepScore: number;
  nightInsight: string;
}

export const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const HealthDataSchema = z.object({
  riskScore: z.number().optional().describe('The current exacerbation risk score (0-100).'),
  coughFrequency: z.number().optional().describe('Average coughs per hour from overnight monitoring.'),
  wheezingDetected: z.boolean().optional().describe('Whether wheezing was detected overnight.'),
  breathingRate: z.number().optional().describe('Average breathing rate (breaths per minute) from overnight monitoring.'),
  aqi: z.number().optional().describe('The current Air Quality Index.'),
  pollenCount: z.string().optional().describe("The current pollen level (e.g., 'Low', 'Moderate', 'High')."),
  sleepQualityScore: z.number().optional().describe('The sleep quality score from the last report (0-100).'),
});
export type HealthData = z.infer<typeof HealthDataSchema>;

export interface Goal {
  id: number;
  type: 'inhalerUsage' | 'sleepScore';
  title: string;
  description: string;
  targetValue: number;
}

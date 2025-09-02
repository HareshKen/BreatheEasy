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

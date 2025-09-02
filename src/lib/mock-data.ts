import type { DailyData, RiskScoreHistory, AcousticData, EnvironmentalData } from "./types";

const today = new Date();
const getLast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const dates = getLast7Days();

export const riskScores: { today: number; history: RiskScoreHistory[] } = {
  today: 78,
  history: dates.map((date, i) => ({
    date,
    score: Math.floor(Math.random() * 40) + 40 - i * 3,
  })),
};

export const acousticData: { today: AcousticData; history: AcousticData[] } = {
  today: {
    coughFrequency: 18,
    wheezing: true,
    breathingRate: 22,
  },
  history: dates.map((date, i) => ({
    date,
    coughFrequency: Math.floor(Math.random() * 8) + 10 - i,
    wheezing: i > 4,
    breathingRate: Math.floor(Math.random() * 3) + 18,
  })),
};

export const environmentalData: { today: EnvironmentalData; history: EnvironmentalData[] } = {
  today: {
    location: 'Mambakkam',
    aqi: 155,
    pollen: 'High',
  },
  history: dates.map((date, i) => ({
    date,
    location: 'Mambakkam',
    aqi: Math.floor(Math.random() * 50) + 110 - i * 5,
    pollen: i > 3 ? 'High' : 'Moderate',
  })),
};

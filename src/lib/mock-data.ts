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

const generateAcousticHistory = (count: number): AcousticData[] => {
    const history: AcousticData[] = [];
    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (count - 1 - i));
        history.push({
            date: date.toISOString().split('T')[0],
            coughFrequency: Math.floor(Math.random() * 25) + 5, // Random frequency between 5 and 30
            wheezing: Math.random() > 0.7, // 30% chance of wheezing
            breathingRate: Math.floor(Math.random() * 8) + 16, // Random rate between 16 and 24
        });
    }
    return history;
}

const acousticHistory50 = generateAcousticHistory(50);

export const acousticData: { history: AcousticData[] } = {
  history: acousticHistory50,
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

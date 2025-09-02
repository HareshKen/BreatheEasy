import type { RiskScoreHistory, AcousticData, EnvironmentalData } from "./types";

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

const generateCorrelatedAcousticData = (): Omit<AcousticData, 'date'> => {
  // 1. Generate Cough Frequency with a distribution skewed towards lower values
  // Squaring the random number biases the distribution towards 0.
  const coughFrequency = Math.floor(Math.pow(Math.random(), 2) * 60);

  // 2. Determine Wheezing probability based on cough frequency
  let wheezingProbability = 0.05; // Base probability for low cough
  if (coughFrequency > 30) {
    wheezingProbability = 0.8;
  } else if (coughFrequency > 5) {
    // Linearly scale probability for coughs between 5 and 30
    wheezingProbability = 0.05 + (coughFrequency - 5) / 25 * 0.75;
  }
  const wheezing = Math.random() < wheezingProbability;

  // 3. Set Breathing Rate based on wheezing
  let breathingRate;
  if (wheezing) {
    // Higher rate to mimic labored breathing: 16-20 bpm
    breathingRate = Math.floor(16 + Math.random() * 5);
  } else {
    // Normal rate: 12-16 bpm
    breathingRate = Math.floor(12 + Math.random() * 5);
  }

  return { coughFrequency, wheezing, breathingRate };
}


const generateAcousticHistory = (count: number): AcousticData[] => {
    const history: AcousticData[] = [];
    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (count - 1 - i));
        history.push({
            date: date.toISOString().split('T')[0],
            ...generateCorrelatedAcousticData(),
        });
    }
    return history;
}

const acousticHistory50 = generateAcousticHistory(50);

export const acousticData: { today: AcousticData, history: AcousticData[] } = {
  today: {
    date: today.toISOString().split('T')[0],
    ...generateCorrelatedAcousticData(),
  },
  history: acousticHistory50,
};

export const environmentalData: { today: EnvironmentalData; history: EnvironmentalData[] } = {
  today: {
    location: 'Palo Alto',
    aqi: 155,
    pollen: 'High',
  },
  history: dates.map((date, i) => ({
    date,
    location: 'Palo Alto',
    aqi: Math.floor(Math.random() * 50) + 110 - i * 5,
    pollen: i > 3 ? 'High' : 'Moderate',
  })),
};

import { config } from 'dotenv';
config();

import '@/ai/flows/generate-data-insights.ts';
import '@/ai/flows/personalized-action-recommendations.ts';
import '@/ai/flows/analyze-cough.ts';
import '@/ai/flows/analyze-sleep-data.ts';
import '@/ai/flows/calculate-risk-score.ts';
import '@/ai/flows/get-environmental-data.ts';
import '@/ai/tools/weather.ts';


"use client";

import { useState } from "react";
import { generateDataInsights } from "@/ai/flows/generate-data-insights";
import { personalizedActionRecommendations } from "@/ai/flows/personalized-action-recommendations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { acousticData as mockAcousticData, environmentalData as mockEnvironmentalData, riskScores as mockRiskScores } from "@/lib/mock-data";
import type { SymptomLog, AcousticData, EnvironmentalData, SleepReport } from "@/lib/types";

type AiCardsProps = {
  riskScore: number;
  symptomLogs: SymptomLog[];
  acousticData: AcousticData | null;
  environmentalData: EnvironmentalData | null;
  sleepReport: SleepReport | null;
};

export function AiCards({ riskScore, symptomLogs, acousticData, environmentalData, sleepReport }: AiCardsProps) {
  const [insights, setInsights] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  const handleGenerateInsights = async () => {
    setIsLoadingInsights(true);
    setInsights("");
    try {
      const result = await generateDataInsights({
        acousticData: JSON.stringify(acousticData ?? mockAcousticData.history[mockAcousticData.history.length - 1]),
        environmentalFactors: JSON.stringify(environmentalData ?? mockEnvironmentalData.history[mockEnvironmentalData.history.length - 1]),
        riskScores: JSON.stringify({ today: riskScore, history: mockRiskScores.history }),
      });
      setInsights(result.insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights("Could not generate insights at this time. Please try again later.");
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleGetRecommendations = async () => {
    setIsLoadingRecs(true);
    setRecommendations("");
    try {
      // Use live data if available, otherwise fall back to the most recent mock data.
      const currentAcoustic = acousticData ?? mockAcousticData.history[mockAcousticData.history.length - 1];
      const currentEnv = environmentalData ?? mockEnvironmentalData.history[mockEnvironmentalData.history.length - 1];
      const lastSymptom = symptomLogs.length > 0 ? symptomLogs[symptomLogs.length - 1] : { phlegmColor: 'N/A', inhalerUsage: 'N/A' };

      const result = await personalizedActionRecommendations({
        exacerbationRiskScore: riskScore,
        acousticDataTrends: `Cough Freq: ${currentAcoustic.coughFrequency}/hr, Wheezing: ${currentAcoustic.wheezing ? 'Yes' : 'No'}, Breathing: ${currentAcoustic.breathingRate}bpm.`,
        environmentalFactors: `AQI: ${currentEnv.aqi}, Pollen: ${currentEnv.pollen}.`,
        symptomData: `Last log: Phlegm was ${lastSymptom.phlegmColor}, Inhaler used ${lastSymptom.inhalerUsage} times.`,
      });
      setRecommendations(result.recommendedActions);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      setRecommendations("Could not get recommendations at this time. Please try again later.");
    } finally {
      setIsLoadingRecs(false);
    }
  };

  return (
    <Card className="h-full">
      <Tabs defaultValue="insights" className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <TabsList className="grid w-full grid-cols-2 mt-2">
            <TabsTrigger value="insights">
              <Lightbulb className="mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Sparkles className="mr-2" />
              Recommendations
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="flex-grow">
          <TabsContent value="insights" className="mt-0">
            <CardDescription className="mb-4">
              Get AI-powered insights based on your recent health data trends.
            </CardDescription>
            <div className="flex flex-col items-start gap-4">
              <Button onClick={handleGenerateInsights} disabled={isLoadingInsights}>
                {isLoadingInsights ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="mr-2" />
                )}
                Generate Insights
              </Button>
              {isLoadingInsights && <p className="text-sm text-muted-foreground">Analyzing your data...</p>}
              {insights && <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{insights}</div>}
            </div>
          </TabsContent>
          <TabsContent value="recommendations" className="mt-0">
            <CardDescription className="mb-4">
              Receive personalized recommendations based on your current risk score.
            </CardDescription>
            <div className="flex flex-col items-start gap-4">
              <Button onClick={handleGetRecommendations} disabled={isLoadingRecs}>
                {isLoadingRecs ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2" />
                )}
                Get Recommendations
              </Button>
              {isLoadingRecs && <p className="text-sm text-muted-foreground">Generating recommendations...</p>}
              {recommendations && <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{recommendations}</div>}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

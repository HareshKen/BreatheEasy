
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Sparkles, Loader2, Bot } from "lucide-react";
import type { SymptomLog, AcousticData, EnvironmentalData, SleepReport, ChatMessage, HealthData } from "@/lib/types";
import { DoctorChatbot } from "./doctor-chatbot";

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
    // This is a mock implementation to avoid hitting API rate limits during development.
    setTimeout(() => {
      setInsights(
        "Based on your recent data:\n\n- Your cough frequency has shown a slight increase over the past two days, coinciding with a rise in the local AQI.\n- Your risk score remains moderate, primarily influenced by environmental factors.\n- Maintaining your current medication schedule is recommended. Consider reducing outdoor exposure on high AQI days."
      );
      setIsLoadingInsights(false);
    }, 1000);
  };

  const handleGetRecommendations = async () => {
    setIsLoadingRecs(true);
    setRecommendations("");
     // This is a mock implementation to avoid hitting API rate limits during development.
    setTimeout(() => {
      let recText = "Your risk score is currently low. Continue to monitor your symptoms and stick to your current medication plan. ";
      if (riskScore > 66) {
        recText = "Your risk score is high. It is recommended to use your rescue inhaler as prescribed and avoid strenuous activities. Pay close attention to your symptoms and consider contacting your healthcare provider if they worsen.";
      } else if (riskScore > 33) {
        recText = "Your risk score is moderate. Be mindful of environmental triggers like high pollen or AQI. Ensure you are consistent with your daily medication and keep your rescue inhaler nearby.";
      }
      setRecommendations(recText);
      setIsLoadingRecs(false);
    }, 1000);
  };

  return (
    <Card className="h-full shadow-cyan-500/10 hover:shadow-cyan-500/20">
      <Tabs defaultValue="insights" className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <TabsList className="grid w-full grid-cols-3 mt-2">
            <TabsTrigger value="insights">
              <Lightbulb className="mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Sparkles className="mr-2" />
              Recommendations
            </TabsTrigger>
             <TabsTrigger value="chatbot">
              <Bot className="mr-2" />
              Chat
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
           <TabsContent value="chatbot" className="mt-0 h-full">
            <DoctorChatbot 
               riskScore={riskScore}
               acousticData={acousticData}
               environmentalData={environmentalData}
               sleepReport={sleepReport}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

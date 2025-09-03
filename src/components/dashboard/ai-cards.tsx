"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Sparkles, Loader2, Bot } from "lucide-react";
import type { SymptomLog, AcousticData, EnvironmentalData, SleepReport } from "@/lib/types";
import { DoctorChatbot } from "./doctor-chatbot";

// --- Custom Hook: useAIGeneration ---
// Encapsulates the logic for an async data generation process, including loading and data states.
// In a real application, this would live in its own file, e.g., `hooks/use-ai-generation.ts`.
const useAIGeneration = (generatorFn: () => Promise<string>) => {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setIsLoading(true);
    setData("");
    setError(null);
    try {
      const result = await generatorFn();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setData(`Sorry, something went wrong. Please try again. Error: ${errorMessage}`);
      console.error("AI Generation failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [generatorFn]);

  return { data, isLoading, error, generate };
};


// --- Reusable Component: AIPanel ---
// A reusable panel for displaying a button that triggers an AI action and shows the result.
// In a real application, this would live in its own file, e.g., `components/ai-panel.tsx`.
type AIPanelProps = {
  description: string;
  buttonText: string;
  loadingText: string;
  Icon: React.ElementType;
  onGenerate: () => void;
  isLoading: boolean;
  data: string;
};

const AIPanel = ({ description, buttonText, loadingText, Icon, onGenerate, isLoading, data }: AIPanelProps) => (
  <>
    <CardDescription className="mb-4">{description}</CardDescription>
    <div className="flex flex-col items-start gap-4">
      <Button onClick={onGenerate} disabled={isLoading} size="sm">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icon className="mr-2 h-4 w-4" />
        )}
        {buttonText}
      </Button>
      {isLoading && <p className="text-sm text-muted-foreground">{loadingText}</p>}
      {data && <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{data}</div>}
    </div>
  </>
);

// --- Helper for Mocking API Calls ---
const mockApiCall = (data: string, delay: number = 1000): Promise<string> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

type AiCardsProps = {
  riskScore: number;
  symptomLogs: SymptomLog[];
  acousticData: AcousticData | null;
  environmentalData: EnvironmentalData | null;
  sleepReport: SleepReport | null;
};

// --- Main Component: AiCards (Refactored) ---
export function AiCards({ riskScore, ...healthData }: AiCardsProps) {
  // Memoize the generator functions to maintain stable references for the `useAIGeneration` hook.
  const insightsGenerator = useCallback(async () => {
    // In a real implementation, `healthData` would be sent in an API request.
    const insightsText = "Based on your recent data:\n\n- Your cough frequency has shown a slight increase over the past two days, coinciding with a rise in the local AQI.\n- Your risk score remains moderate, primarily influenced by environmental factors.\n- Maintaining your current medication schedule is recommended. Consider reducing outdoor exposure on high AQI days.";
    return mockApiCall(insightsText);
  }, [healthData]); // Dependency on the rest of the health data

  const recommendationsGenerator = useCallback(async () => {
    // Logic is based on the riskScore.
    let recText = "Your risk score is currently low. Continue to monitor your symptoms and stick to your current medication plan.";
    if (riskScore > 66) {
      recText = "Your risk score is high. It is recommended to use your rescue inhaler as prescribed and avoid strenuous activities. Pay close attention to your symptoms and consider contacting your healthcare provider if they worsen.";
    } else if (riskScore > 33) {
      recText = "Your risk score is moderate. Be mindful of environmental triggers like high pollen or AQI. Ensure you are consistent with your daily medication and keep your rescue inhaler nearby.";
    }
    return mockApiCall(recText);
  }, [riskScore]); // Dependency is only the risk score

  const { data: insights, isLoading: isLoadingInsights, generate: handleGenerateInsights } = useAIGeneration(insightsGenerator);
  const { data: recommendations, isLoading: isLoadingRecs, generate: handleGetRecommendations } = useAIGeneration(recommendationsGenerator);

  return (
    <Card className="h-full shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-shadow">
      <Tabs defaultValue="insights" className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <TabsList className="grid w-full grid-cols-3 mt-2">
            <TabsTrigger value="insights">
              <Lightbulb className="mr-2 h-4 w-4" /> Insights
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Sparkles className="mr-2 h-4 w-4" /> Recommendations
            </TabsTrigger>
            <TabsTrigger value="chatbot">
              <Bot className="mr-2 h-4 w-4" /> Chat
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
          <TabsContent value="insights" className="mt-0">
            <AIPanel
              description="Get AI-powered insights based on your recent health data trends."
              buttonText="Generate Insights"
              loadingText="Analyzing your data..."
              Icon={Lightbulb}
              onGenerate={handleGenerateInsights}
              isLoading={isLoadingInsights}
              data={insights}
            />
          </TabsContent>
          <TabsContent value="recommendations" className="mt-0">
            <AIPanel
              description="Receive personalized recommendations based on your current risk score."
              buttonText="Get Recommendations"
              loadingText="Generating recommendations..."
              Icon={Sparkles}
              onGenerate={handleGetRecommendations}
              isLoading={isLoadingRecs}
              data={recommendations}
            />
          </TabsContent>
          <TabsContent value="chatbot" className="mt-0 h-full">
            <DoctorChatbot 
                riskScore={riskScore}
                {...healthData}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
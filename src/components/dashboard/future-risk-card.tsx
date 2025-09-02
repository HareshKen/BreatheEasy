"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingUp, Sparkles, Loader2, AlertTriangle } from "lucide-react";
import type { RiskScoreHistory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

// This is a mock implementation to avoid hitting API rate limits during development.
const generateMockFutureRisk = (historicalScores: RiskScoreHistory[]): { predictedRiskScore: number; proactiveAlert: string } => {
  const lastScore = historicalScores.length > 0 ? historicalScores[historicalScores.length - 1].score : 50;
  
  // Simulate environmental forecast
  const mockForecast = {
    pollen: Math.random() > 0.5 ? 'High' : 'Low',
    aqi: Math.floor(Math.random() * 100) + 50,
  };

  let predictedScore = lastScore + (Math.random() * 20 - 10); // Fluctuate around the last score
  let proactiveAlert = "The forecast looks good for the next couple of days. Continue your current routine and enjoy the clear air!";

  if (mockForecast.pollen === 'High' || mockForecast.aqi > 100) {
    predictedScore += Math.random() * 20; // Increase score if forecast is bad
    proactiveAlert = `A high ${mockForecast.pollen === 'High' ? 'pollen count' : 'AQI'} is forecasted tomorrow. Remember to take your controller medication and consider staying indoors.`;
  }

  predictedScore = Math.min(100, Math.max(0, Math.round(predictedScore)));

  return {
    predictedRiskScore: predictedScore,
    proactiveAlert: proactiveAlert,
  };
};

type FutureRiskCardProps = {
  historicalRiskScores: RiskScoreHistory[];
};

export function FutureRiskCard({ historicalRiskScores }: FutureRiskCardProps) {
  const [prediction, setPrediction] = useState<{ score: number; alert: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateForecast = async () => {
    setIsLoading(true);
    setPrediction(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const result = generateMockFutureRisk(historicalRiskScores);
      setPrediction({ score: result.predictedRiskScore, alert: result.proactiveAlert });
    } catch (error) {
      console.error("Error generating future risk:", error);
      toast({
        title: "Error",
        description: "Could not generate forecast at this time.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score <= 33) return "text-accent";
    if (score <= 66) return "text-yellow-500";
    return "text-destructive";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Future Risk Forecast</CardTitle>
        <CardDescription>Predict your risk for the next 24-48h.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-4 text-center">
        {!prediction && !isLoading && (
          <>
            <TrendingUp className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Get a personalized risk forecast based on your history and local environmental predictions.
            </p>
          </>
        )}
        
        {isLoading && <Loader2 className="h-12 w-12 animate-spin text-primary" />}

        {prediction && (
          <div className="w-full space-y-4">
             <div className="text-6xl font-bold" style={{ color: getScoreColor(prediction.score) }}>
              {prediction.score}
            </div>
            <p className="text-muted-foreground">Predicted Risk Score</p>
             <Alert className={`${getScoreColor(prediction.score).replace('text-', 'border-')} bg-background`}>
                <AlertTriangle className={getScoreColor(prediction.score)} />
                <AlertTitle className="font-semibold">Proactive Alert</AlertTitle>
                <AlertDescription>{prediction.alert}</AlertDescription>
            </Alert>
          </div>
        )}
        
        <div className="pt-4">
          <Button onClick={handleGenerateForecast} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2" />}
            {prediction ? 'Regenerate Forecast' : 'Generate Forecast'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

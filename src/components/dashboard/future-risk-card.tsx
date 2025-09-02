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
  if (historicalScores.length === 0) {
    return {
      predictedRiskScore: 25,
      proactiveAlert: "Not enough data for a prediction. Log your symptoms to get started.",
    };
  }

  const lastScore = historicalScores[historicalScores.length - 1].score;
  const averageScore = historicalScores.reduce((acc, curr) => acc + curr.score, 0) / historicalScores.length;
  const trend = lastScore - averageScore;

  // Simulate environmental forecast
  const mockForecast = {
    pollen: Math.random() > 0.5 ? 'High' : 'Low',
    aqi: Math.floor(Math.random() * 70) + 30, // Skew towards better AQI
  };

  let predictedScore = averageScore;
  let proactiveAlert = "";

  // Adjust based on trend
  if (trend > 5) {
    predictedScore += 10; // Increasing risk trend
    proactiveAlert = "Your risk has been trending upwards. Be extra mindful of your symptoms over the next couple of days.";
  } else if (trend < -5) {
    predictedScore -= 10; // Decreasing risk trend
    proactiveAlert = "Your risk has been trending down. Keep up the great work with your management routine!";
  } else {
    proactiveAlert = "Your risk score is stable. Continue your current routine and enjoy the clear air!";
  }

  // Adjust based on forecast
  if (mockForecast.pollen === 'High') {
    predictedScore += 15;
    proactiveAlert += " High pollen is forecasted tomorrow, which may increase your risk. Consider limiting outdoor time.";
  }
  if (mockForecast.aqi > 80) {
    predictedScore += 10;
    proactiveAlert += " The AQI is expected to be high. It's a good idea to stay indoors if possible.";
  }

  predictedScore = Math.min(100, Math.max(0, Math.round(predictedScore)));

  return {
    predictedRiskScore: predictedScore,
    proactiveAlert: proactiveAlert.trim(),
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
  
  const getScoreColorClass = (score: number) => {
    if (score <= 33) return "text-accent";
    if (score <= 66) return "text-yellow-500";
    return "text-destructive";
  };

  const getBorderColorClass = (score: number) => {
    if (score <= 33) return "border-accent";
    if (score <= 66) return "border-yellow-500";
    return "border-destructive";
  }

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
             <div className={`text-6xl font-bold ${getScoreColorClass(prediction.score)}`}>
              {prediction.score}
            </div>
            <p className="text-muted-foreground">Predicted Risk Score</p>
             <Alert className={`${getBorderColorClass(prediction.score)} bg-background`}>
                <AlertTriangle className={getScoreColorClass(prediction.score)} />
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

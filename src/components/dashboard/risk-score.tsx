"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { riskScores } from "@/lib/mock-data";
import { useEffect, useState } from "react";

const getScoreColor = (score: number) => {
  if (score <= 33) return "hsl(var(--accent))";
  if (score <= 66) return "hsl(var(--chart-4))";
  return "hsl(var(--destructive))";
};

const getScoreLabel = (score: number) => {
  if (score <= 33) return "Low Risk";
  if (score <= 66) return "Moderate Risk";
  return "High Risk";
};


export function RiskScore() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const animation = setTimeout(() => setScore(riskScores.today), 300);
    return () => clearTimeout(animation);
  }, []);

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const circumference = 2 * Math.PI * 60; // 2 * pi * radius
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Exacerbation Risk Score</CardTitle>
        <CardDescription>Your daily respiratory risk level</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
        <div className="relative h-40 w-40">
          <svg className="w-full h-full" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="12"
            />
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke={scoreColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: scoreColor }}>
              {Math.round(score)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="text-center">
            <p className="text-lg font-semibold" style={{ color: scoreColor }}>{scoreLabel}</p>
            <p className="text-sm text-muted-foreground">Based on recent data</p>
        </div>
      </CardContent>
    </Card>
  );
}

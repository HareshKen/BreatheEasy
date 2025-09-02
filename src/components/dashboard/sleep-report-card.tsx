
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, BarChart, Loader2, Sparkles, Moon } from "lucide-react";
import { analyzeSleepData } from "@/ai/flows/analyze-sleep-data";
import type { AcousticData, SleepReport } from "@/lib/types";

type SleepReportCardProps = {
  acousticData: AcousticData | null;
  onReportGenerated: (report: SleepReport | null) => void;
};

export function SleepReportCard({ acousticData, onReportGenerated }: SleepReportCardProps) {
  const [report, setReport] = useState<SleepReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerateReport = async () => {
    if (!acousticData) return;
    
    setIsLoading(true);
    setReport(null);
    onReportGenerated(null);

    try {
      const result = await analyzeSleepData({
        nightlyAcousticData: JSON.stringify(acousticData),
      });
      setReport(result);
      onReportGenerated(result);
    } catch (error) {
      console.error("Error generating sleep report:", error);
      const errorReport = {
        sleepScore: 0,
        nightInsight: "Could not generate a report at this time. Please try again later.",
      };
      setReport(errorReport);
      onReportGenerated(errorReport);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sleep Report</CardTitle>
        <CardDescription>Get an AI-generated summary of your overnight respiratory activity.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {!report && (
           <div className="flex flex-col items-start gap-4">
             <Button onClick={handleGenerateReport} disabled={isLoading || !acousticData}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2" />}
                Analyze Last Night
            </Button>
            {isLoading && <p className="text-sm text-muted-foreground">Generating your sleep report...</p>}
          </div>
        )}

        {report && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border p-4">
               <h3 className="text-lg font-medium">Sleep Quality Score</h3>
               <div className="relative h-32 w-32">
                 <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      strokeDasharray={`${(report.sleepScore / 100) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                      className="transition-all duration-1000 ease-out"
                    />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">{report.sleepScore}</span>
                 </div>
               </div>
               <p className="text-sm text-muted-foreground">out of 100</p>
            </div>
            <div className="md:col-span-2 rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2 flex items-center"><Moon className="mr-2 text-primary"/> Night Insight</h3>
                <p className="text-sm text-foreground whitespace-pre-wrap">{report.nightInsight}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

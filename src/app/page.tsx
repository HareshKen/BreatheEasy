
'use client';

import { useState } from 'react';
import type { SymptomLog, AcousticData, SleepReport, EnvironmentalData } from '@/lib/types';
import { Header } from '@/components/dashboard/header';
import { RiskScore } from '@/components/dashboard/risk-score';
import { AiCards } from '@/components/dashboard/ai-cards';
import { DataCharts } from '@/components/dashboard/data-charts';
import { AcousticMonitorCard } from '@/components/dashboard/acoustic-monitor-card';
import { EnvironmentCard } from '@/components/dashboard/environment-card';
import { SleepReportCard } from '@/components/dashboard/sleep-report-card';
import { useToast } from '@/hooks/use-toast';
import { SymptomLoggerCard } from '@/components/dashboard/symptom-logger-card';
import { DoctorChatbot } from '@/components/dashboard/doctor-chatbot';

// Mock implementation to avoid API rate limits during development.
const calculateMockRiskScore = (logs: SymptomLog[]): { riskScore: number; explanation: string } => {
  if (logs.length === 0) {
    return { riskScore: 0, explanation: "Log symptoms to see your score." };
  }

  const lastLog = logs[logs.length - 1];
  let score = 0;
  let phlegmScore = 0;
  let inhalerScore = 0;

  // Phlegm Color Score Contribution
  switch (lastLog.phlegmColor) {
    case 'Clear':
      phlegmScore = Math.floor(Math.random() * 11); // 0-10
      break;
    case 'White':
      phlegmScore = Math.floor(Math.random() * 16) + 10; // 10-25
      break;
    case 'Yellow':
      phlegmScore = Math.floor(Math.random() * 26) + 25; // 25-50
      break;
    case 'Green':
    case 'Other':
      phlegmScore = Math.floor(Math.random() * 21) + 50; // 50-70
      break;
  }

  // Inhaler Usage Score Contribution
  if (lastLog.inhalerUsage === 0) {
    inhalerScore = Math.floor(Math.random() * 6); // 0-5
  } else if (lastLog.inhalerUsage === 1) {
    inhalerScore = Math.floor(Math.random() * 11) + 5; // 5-15
  } else if (lastLog.inhalerUsage === 2) {
    inhalerScore = Math.floor(Math.random() * 16) + 15; // 15-30
  } else {
    inhalerScore = Math.floor(Math.random() * 21) + 30; // 30-50
  }
  
  score = Math.min(100, phlegmScore + inhalerScore);

  let explanation = "Your score is based on recent symptom logs. ";
  if (score > 60) {
    explanation += `It is elevated due to reports of ${lastLog.phlegmColor.toLowerCase()} phlegm and high inhaler usage.`;
  } else if (score > 30) {
    explanation += `It is moderate, influenced by ${lastLog.phlegmColor.toLowerCase()} phlegm and some inhaler usage.`;
  } else {
    explanation += "Your reported symptoms indicate a low risk level.";
  }

  return {
    riskScore: score,
    explanation: explanation,
  };
};


export default function DashboardPage() {
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
  const [currentRiskScore, setCurrentRiskScore] = useState(0);
  const [riskScoreExplanation, setRiskScoreExplanation] = useState<string | null>('Please log symptoms to see your Exacerbation Risk Score');
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [isFetchingAqi, setIsFetchingAqi] = useState(true);
  const { toast } = useToast();
  const [acousticData, setAcousticData] = useState<AcousticData | null>(null);
  const [sleepReport, setSleepReport] = useState<SleepReport | null>(null);

  const addSymptomLog = async (log: Omit<SymptomLog, 'dateTime'>) => {
    const newLogs = [...symptomLogs, { ...log, dateTime: new Date() }];
    setSymptomLogs(newLogs);

    setIsCalculatingScore(true);
    setRiskScoreExplanation('Calculating score based on your symptom logs...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const result = calculateMockRiskScore(newLogs);
      setCurrentRiskScore(result.riskScore);
      setRiskScoreExplanation(result.explanation);
       if (newLogs.length === 1) {
         toast({
            title: "Analyzing First Symptom",
            description: "We're calculating your initial risk score.",
         });
       }
    } catch (error) {
      console.error("Error calculating mock risk score:", error);
      toast({
        title: "Error",
        description: "Could not calculate risk score at this time.",
        variant: "destructive",
      });
      setRiskScoreExplanation('Could not calculate score. Please try again.');
    } finally {
      setIsCalculatingScore(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <AcousticMonitorCard onDataLoaded={setAcousticData} />
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <EnvironmentCard onDataFetched={setEnvironmentalData} onLoadingChange={setIsFetchingAqi} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <SleepReportCard acousticData={acousticData} onReportGenerated={setSleepReport} />
          </div>
           <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <SymptomLoggerCard addSymptomLog={addSymptomLog} logs={symptomLogs} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <DoctorChatbot 
              riskScore={currentRiskScore}
              acousticData={acousticData}
              environmentalData={environmentalData}
              sleepReport={sleepReport}
            />
          </div>
          <div className="lg:col-span-3 md:col-span-2">
            <AiCards 
              riskScore={currentRiskScore}
              symptomLogs={symptomLogs}
              acousticData={acousticData}
              environmentalData={environmentalData}
              sleepReport={sleepReport}
            />
          </div>
          <div className="lg:col-span-1 md:col-span-2">
            <RiskScore 
              score={currentRiskScore} 
              explanation={riskScoreExplanation} 
              isLoading={isCalculatingScore} 
            />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <DataCharts 
              riskScore={currentRiskScore}
              aqi={environmentalData?.aqi}
              isLoading={isFetchingAqi || (symptomLogs.length >= 1 && isCalculatingScore)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

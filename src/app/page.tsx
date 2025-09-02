
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
import { SymptomHistoryCard } from '@/components/dashboard/symptom-history-card';
import { useToast } from '@/hooks/use-toast';
import { calculateRiskScore } from '@/ai/flows/calculate-risk-score';
import { SymptomLoggerCard } from '@/components/dashboard/symptom-logger-card';

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

    if (newLogs.length === 3) {
      setIsCalculatingScore(true);
      setRiskScoreExplanation('Calculating score based on your first 3 symptom logs...');
      toast({
        title: "Analyzing Symptoms",
        description: "You've logged your first 3 symptoms. We're calculating your initial risk score.",
      });

      try {
        const result = await calculateRiskScore({
          symptomLogs: JSON.stringify(newLogs),
        });
        setCurrentRiskScore(result.riskScore);
        setRiskScoreExplanation(result.explanation);
      } catch (error) {
        console.error("Error calculating risk score:", error);
        toast({
          title: "Error",
          description: "Could not calculate risk score at this time.",
          variant: "destructive",
        });
        setRiskScoreExplanation('Could not calculate score. Please try again.');
      } finally {
        setIsCalculatingScore(false);
      }
    } else if (newLogs.length > 3) {
      // Optional: decide if you want to recalculate on every new log after 3.
      // For now, we only calculate on the first 3.
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
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
            <SymptomLoggerCard addSymptomLog={addSymptomLog} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <SleepReportCard acousticData={acousticData} onReportGenerated={setSleepReport} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <SymptomHistoryCard logs={symptomLogs} />
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
              isLoading={isFetchingAqi || (symptomLogs.length >= 3 && isCalculatingScore)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

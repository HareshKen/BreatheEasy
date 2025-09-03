import type { Goal, SymptomLog, SleepReport } from '@/lib/types';
import { GoalsSheet } from './goals-sheet';
import { EmergencySOS } from './emergency-sos';
import { Waves } from 'lucide-react';

type HeaderProps = {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  symptomLogs: SymptomLog[];
  sleepReport: SleepReport | null;
  riskScore: number;
};

export function Header({ goals, addGoal, symptomLogs, sleepReport, riskScore }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2 flex-1">
        <Waves className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-foreground">BreatheEasy</h1>
      </div>
      <div className="flex-1 flex justify-center">
         <EmergencySOS riskScore={riskScore} symptomLogs={symptomLogs} />
      </div>
      <div className="flex-1 flex justify-end">
        <GoalsSheet 
          goals={goals} 
          addGoal={addGoal} 
          symptomLogs={symptomLogs} 
          sleepReport={sleepReport} 
        />
      </div>
    </header>
  );
}

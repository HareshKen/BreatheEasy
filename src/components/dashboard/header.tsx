import type { Goal, SymptomLog, SleepReport } from '@/lib/types';
import { GoalsSheet } from './goals-sheet';
import { EmergencySOS } from './emergency-sos';

// Custom Lung icon component
const LungIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 21v-5" />
    <path d="M6.7 16H4.5C3 16 2 15 2 13.5c0-1 .5-2.5 3-3" />
    <path d="M17.3 16h2.2c1.5 0 2.5-1 2.5-2.5 0-1-.5-2.5-3-3" />
    <path d="M8 16s1.5-2 4-2 4 2 4 2" />
    <path d="M8 12c-3-2.5-3-5.5-1-7.5s4-2 5 0c1 2 0 5-1 6.5" />
    <path d="M16 12c3-2.5 3-5.5 1-7.5s-4-2-5 0c-1 2 0 5 1 6.5" />
  </svg>
);


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
        <LungIcon className="h-6 w-6 text-primary" />
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

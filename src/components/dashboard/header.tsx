import type { Goal, SymptomLog, SleepReport } from '@/lib/types';
import { GoalsSheet } from './goals-sheet';

type HeaderProps = {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  symptomLogs: SymptomLog[];
  sleepReport: SleepReport | null;
};

export function Header({ goals, addGoal, symptomLogs, sleepReport }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          className="h-6 w-6 text-primary"
        >
          <rect width="256" height="256" fill="none" />
          <path
            d="M128,216S28,176,28,112V64A12,12,0,0,1,40,52H216a12,12,0,0,1,12,12v48c0,64-100,104-100,104Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <path
            d="M176,100a48,48,0,0,1-96,0"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
        </svg>
        <h1 className="text-xl font-bold text-foreground">RespiGuard</h1>
      </div>
      <GoalsSheet 
        goals={goals} 
        addGoal={addGoal} 
        symptomLogs={symptomLogs} 
        sleepReport={sleepReport} 
      />
    </header>
  );
}

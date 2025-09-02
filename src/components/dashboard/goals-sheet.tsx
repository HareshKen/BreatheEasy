
"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { GoalsCard } from "./goals-card";
import type { Goal, SymptomLog, SleepReport } from "@/lib/types";

type GoalsSheetProps = {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  symptomLogs: SymptomLog[];
  sleepReport: SleepReport | null;
};

export function GoalsSheet({ goals, addGoal, symptomLogs, sleepReport }: GoalsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Target className="mr-2" />
          My Goals
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Personalized Goals</SheetTitle>
          <SheetDescription>
            Set and track your health objectives to stay on top of your condition.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <GoalsCard 
            goals={goals} 
            addGoal={addGoal} 
            symptomLogs={symptomLogs} 
            sleepReport={sleepReport} 
            isInSheet={true}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

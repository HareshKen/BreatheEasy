
"use client";

import { useState, useEffect, useRef } from "react";
import type { Goal, SymptomLog, SleepReport } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Target, Award, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type GoalsCardProps = {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  symptomLogs: SymptomLog[];
  sleepReport: SleepReport | null;
  isInSheet?: boolean;
};

const getInhalerUsageLast7Days = (logs: SymptomLog[]): number => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return logs
    .filter(log => log.dateTime > sevenDaysAgo)
    .reduce((sum, log) => sum + log.inhalerUsage, 0);
};

const calculateProgressValue = (goal: Goal, symptomLogs: SymptomLog[], sleepReport: SleepReport | null): number => {
    if (goal.type === 'inhalerUsage') {
        const currentUsage = getInhalerUsageLast7Days(symptomLogs);
        // If current is 2 and target is 5, progress is how close you are to the target
        // We want usage <= target. Progress is 100 if we meet it.
        if (currentUsage <= goal.targetValue) return 100;
        // If not met, show how far off we are. Let's show 0 if not met for simplicity.
        // A more complex progress could be `100 * (initialUsage - currentUsage) / (initialUsage - target)`
        // For now, it's binary: 0% or 100%
        return 0; // Or a more granular progress. For this goal, 100% when met is clear.
    }
    if (goal.type === 'sleepScore') {
        const currentScore = sleepReport?.sleepScore ?? 0;
        return Math.min(100, (currentScore / goal.targetValue) * 100);
    }
    return 0;
};


export function GoalsCard({ goals, addGoal, symptomLogs, sleepReport, isInSheet = false }: GoalsCardProps) {
  const [open, setOpen] = useState(false);
  const [goalType, setGoalType] = useState<Goal['type'] | ''>('');
  const [targetValue, setTargetValue] = useState('0');
  const { toast } = useToast();
  const previouslyAchievedGoals = useRef<Set<number>>(new Set());

  useEffect(() => {
    const newlyAchievedGoals: Goal[] = [];
    
    goals.forEach(goal => {
        const progress = calculateProgressValue(goal, symptomLogs, sleepReport);
        const isAchieved = progress >= 100;

        if (isAchieved && !previouslyAchievedGoals.current.has(goal.id)) {
            newlyAchievedGoals.push(goal);
            previouslyAchievedGoals.current.add(goal.id);
        } else if (!isAchieved && previouslyAchievedGoals.current.has(goal.id)) {
            // Optional: allow re-triggering if a goal becomes un-achieved and then achieved again
            previouslyAchievedGoals.current.delete(goal.id);
        }
    });

    if (newlyAchievedGoals.length > 0) {
        newlyAchievedGoals.forEach(goal => {
            toast({
                title: "Goal Achieved!",
                description: `Yay! You achieved your goal: "${goal.title}"`,
                className: 'bg-accent text-accent-foreground border-accent',
            });
        });
    }
  }, [goals, symptomLogs, sleepReport, toast]);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!goalType) {
      toast({
        title: "Missing Information",
        description: "Please select a goal type.",
        variant: "destructive",
      });
      return;
    }

    const target = parseInt(targetValue, 10);
    if (isNaN(target) || target < 0) {
        toast({
            title: "Invalid Value",
            description: "Please enter a valid, non-negative number for your target.",
            variant: "destructive",
        });
        return;
    }

    let title = '';
    let description = '';
    if (goalType === 'inhalerUsage') {
        title = `Reduce Inhaler Use`;
        description = `Target: ${target} or less times per week`;
    } else if (goalType === 'sleepScore') {
        title = `Improve Sleep Score`;
        description = `Target: Score above ${target}`;
    }

    addGoal({
      id: Date.now(),
      type: goalType,
      title,
      description,
      targetValue: target,
    });

    setGoalType('');
    setTargetValue('0');
    setOpen(false);
  };
  
  const calculateProgressDisplay = (goal: Goal): { progress: number; progressText: string, icon: React.ReactNode } => {
    if (goal.type === 'inhalerUsage') {
        const currentUsage = getInhalerUsageLast7Days(symptomLogs);
        const isAchieved = currentUsage <= goal.targetValue;
        const progress = isAchieved ? 100 : ( (goal.targetValue / (currentUsage === 0 ? 1 : currentUsage) ) * 100);
        const icon = isAchieved ? <Award className="text-accent" /> : (currentUsage > goal.targetValue ? <TrendingUp className="text-destructive" /> : <TrendingDown className="text-accent" />);
        return { progress, progressText: `${currentUsage}/${goal.targetValue} times used`, icon };
    }
    if (goal.type === 'sleepScore') {
        const currentScore = sleepReport?.sleepScore ?? 0;
        const progress = Math.min(100, (currentScore / goal.targetValue) * 100);
        const isAchieved = currentScore >= goal.targetValue;
        const icon = isAchieved ? <Award className="text-accent" /> : <TrendingUp className="text-yellow-500" />;
        return { progress, progressText: `${currentScore}/${goal.targetValue} score`, icon };
    }
    return { progress: 0, progressText: 'N/A', icon: null };
  };
  
  const cardContent = (
    <>
        {goals.length > 0 ? (
          <div className="space-y-6">
            {goals.map((goal) => {
              const { progress, progressText, icon } = calculateProgressDisplay(goal);
              return (
                <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                       <div className="font-semibold">{goal.title}</div>
                       <div className="text-sm text-muted-foreground">{goal.description}</div>
                    </div>
                    <div className="flex items-center gap-4">
                       <Progress value={progress} className="w-full" />
                       <div className="flex items-center gap-2 text-sm font-mono whitespace-nowrap">
                         {icon}
                         <span>{progressText}</span>
                       </div>
                    </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
            <Target className="mx-auto h-12 w-12" />
            <p className="mt-4 font-medium">No goals set yet.</p>
            <p className="text-sm">Click "New Goal" to start tracking your progress!</p>
          </div>
        )}
    </>
  );

  const dialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle />
          New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Set a New Goal</DialogTitle>
            <DialogDescription>
              Choose a goal and set your target to start tracking.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goal-type" className="text-right">
                Goal Type
              </Label>
              <Select value={goalType} onValueChange={(value) => setGoalType(value as Goal['type'])}>
                <SelectTrigger id="goal-type" className="col-span-3">
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inhalerUsage">Reduce Inhaler Usage</SelectItem>
                  <SelectItem value="sleepScore">Improve Sleep Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target-value" className="text-right">
                Target
              </Label>
              <Input
                id="target-value"
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="col-span-3"
                min="0"
                placeholder={goalType === 'inhalerUsage' ? 'e.g., 5 times/week' : 'e.g., 80'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Set Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  if (isInSheet) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          {dialog}
        </div>
        {cardContent}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Personalized Goals</CardTitle>
          <CardDescription>Set and track your health objectives.</CardDescription>
        </div>
        {dialog}
      </CardHeader>
      <CardContent>
        {cardContent}
      </CardContent>
    </Card>
  );
}

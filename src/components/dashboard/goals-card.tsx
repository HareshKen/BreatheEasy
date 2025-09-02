
"use client";

import { useState } from "react";
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

export function GoalsCard({ goals, addGoal, symptomLogs, sleepReport, isInSheet = false }: GoalsCardProps) {
  const [open, setOpen] = useState(false);
  const [goalType, setGoalType] = useState<Goal['type'] | ''>('');
  const [targetValue, setTargetValue] = useState('0');
  const { toast } = useToast();

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
        description = `Target: Less than ${target} times per week`;
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
  
  const calculateProgress = (goal: Goal): { progress: number; progressText: string, icon: React.ReactNode } => {
    if (goal.type === 'inhalerUsage') {
        const currentUsage = getInhalerUsageLast7Days(symptomLogs);
        // Progress is how close you are to 0 from your starting point (the target)
        // If current is 2 and target is 5, you are 3 steps closer to 0, so 3/5 = 60%
        const progress = Math.max(0, 100 * (1 - (currentUsage / goal.targetValue)));
        const icon = currentUsage < goal.targetValue ? <TrendingDown className="text-accent" /> : <TrendingUp className="text-destructive" />;
        return { progress, progressText: `${currentUsage}/${goal.targetValue} times used`, icon };
    }
    if (goal.type === 'sleepScore') {
        const currentScore = sleepReport?.sleepScore ?? 0;
        const progress = Math.min(100, (currentScore / goal.targetValue) * 100);
        const icon = currentScore >= goal.targetValue ? <Award className="text-accent" /> : <TrendingUp className="text-yellow-500" />;
        return { progress, progressText: `${currentScore}/${goal.targetValue} score`, icon };
    }
    return { progress: 0, progressText: 'N/A', icon: null };
  };
  
  const cardContent = (
    <>
        {goals.length > 0 ? (
          <div className="space-y-6">
            {goals.map((goal) => {
              const { progress, progressText, icon } = calculateProgress(goal);
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

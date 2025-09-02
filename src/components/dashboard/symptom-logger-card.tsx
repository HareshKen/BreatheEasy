
"use client";

import type { SymptomLog } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SymptomLogger } from "./symptom-logger";

type SymptomLoggerCardProps = {
  addSymptomLog: (log: Omit<SymptomLog, 'dateTime'>) => void;
};

export function SymptomLoggerCard({ addSymptomLog }: SymptomLoggerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Logger</CardTitle>
        <CardDescription>
          Log your daily symptoms and inhaler usage to track your condition and calculate your risk score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SymptomLogger addSymptomLog={addSymptomLog} />
      </CardContent>
    </Card>
  );
}

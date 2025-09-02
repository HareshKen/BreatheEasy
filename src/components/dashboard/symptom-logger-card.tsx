
"use client";

import type { SymptomLog } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { SymptomLogger } from "./symptom-logger";

type SymptomLoggerCardProps = {
  addSymptomLog: (log: Omit<SymptomLog, 'dateTime'>) => void;
  logs: SymptomLog[];
};

export function SymptomLoggerCard({ addSymptomLog, logs }: SymptomLoggerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Log</CardTitle>
        <CardDescription>
          Log your daily symptoms to track your condition and view your history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SymptomLogger addSymptomLog={addSymptomLog} />

        <div>
          <h3 className="text-lg font-medium mb-2">History</h3>
          {logs.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Phlegm Color</TableHead>
                    <TableHead className="text-right">Inhaler Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.slice().reverse().map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.dateTime.toLocaleString()}</TableCell>
                      <TableCell>{log.phlegmColor}</TableCell>
                      <TableCell className="text-right">{log.inhalerUsage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 border rounded-md">
              No symptoms logged yet. Click "Log Symptoms" to get started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

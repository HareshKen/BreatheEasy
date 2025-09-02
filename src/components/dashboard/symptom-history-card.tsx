
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { SymptomLog } from "@/lib/types";

type SymptomHistoryCardProps = {
  logs: SymptomLog[];
};

export function SymptomHistoryCard({ logs }: SymptomHistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom History</CardTitle>
        <CardDescription>A log of your recorded symptoms and inhaler usage.</CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
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
        ) : (
          <p className="text-center text-muted-foreground py-8">No symptoms logged yet. Click "Log Symptoms" to get started.</p>
        )}
      </CardContent>
    </Card>
  );
}

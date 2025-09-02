import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Ear, Waves, HeartPulse } from "lucide-react";
import { acousticData } from "@/lib/mock-data";

export function AcousticMonitorCard() {
  const { coughFrequency, wheezing, breathingRate } = acousticData.today;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acoustic Monitoring</CardTitle>
        <CardDescription>Overnight audio analysis results</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <Waves className="h-5 w-5 text-secondary-foreground" />
            </div>
            <span className="font-medium">Cough Frequency</span>
          </div>
          <span className="text-lg font-semibold">{coughFrequency} <span className="text-sm font-normal text-muted-foreground">/hr</span></span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <Ear className="h-5 w-5 text-secondary-foreground" />
            </div>
            <span className="font-medium">Wheeze Detection</span>
          </div>
          <span className={`text-lg font-semibold ${wheezing ? 'text-destructive' : 'text-accent'}`}>{wheezing ? "Detected" : "None"}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <HeartPulse className="h-5 w-5 text-secondary-foreground" />
            </div>
            <span className="font-medium">Breathing Rate</span>
          </div>
          <span className="text-lg font-semibold">{breathingRate} <span className="text-sm font-normal text-muted-foreground">bpm</span></span>
        </div>
      </CardContent>
    </Card>
  );
}

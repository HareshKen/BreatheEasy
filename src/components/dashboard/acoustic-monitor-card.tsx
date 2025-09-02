
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ear, Waves, HeartPulse, Lightbulb, Mic, Square, Loader2, TestTube, ListTree } from "lucide-react";
import { acousticData as mockAcousticData } from "@/lib/mock-data";
import type { AcousticData, AnalyzeCoughOutput } from "@/lib/types";

// Mock implementation to avoid API rate limits during development.
const generateMockCoughAnalysis = (): AnalyzeCoughOutput => {
  const coughTypes: AnalyzeCoughOutput['coughType'][] = ['Productive', 'Non-productive'];
  const characteristics = ['harsh', 'wheezy', 'sharp', 'barking'];
  
  const selectedType = coughTypes[Math.floor(Math.random() * coughTypes.length)];
  const selectedChars = characteristics.sort(() => 0.5 - Math.random()).slice(0, 2).join(', ');
  
  return {
    coughType: selectedType,
    characteristics: selectedChars,
    summary: `This appears to be a ${selectedType.toLowerCase()} cough with ${selectedChars} characteristics.`,
  };
};

type AcousticMonitorCardProps = {
  onDataLoaded: (data: AcousticData | null) => void;
};

export function AcousticMonitorCard({ onDataLoaded }: AcousticMonitorCardProps) {
  const [displayData, setDisplayData] = useState<AcousticData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeCoughOutput | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // This now runs only on the client
    const todayData = mockAcousticData.today;
    setDisplayData(todayData);
    onDataLoaded(todayData);
  }, [onDataLoaded]);

  const handleStartRecording = async () => {
    setAnalysis(null);
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsLoading(true);
        // We don't need to process the audio blob for the mock
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
          const result = generateMockCoughAnalysis();
          setAnalysis(result);
        } catch (error) {
          console.error("Error generating mock cough analysis:", error);
          setError("Could not analyze cough at this time. Please try again.");
        } finally {
          setIsLoading(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Microphone access was denied. Please allow access to use this feature.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Card className="shadow-cyan-500/10 hover:shadow-cyan-500/20">
      <CardHeader>
        <CardTitle>Acoustic Monitoring</CardTitle>
        <CardDescription>Overnight audio analysis and live check</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <Waves className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="font-medium">Cough Frequency</span>
          </div>
          <span className="text-lg font-semibold">{displayData?.coughFrequency ?? '...'} <span className="text-sm font-normal text-muted-foreground">/hr</span></span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <Ear className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="font-medium">Wheeze Detection</span>
          </div>
          <span className={`text-lg font-semibold ${displayData?.wheezing ? 'text-destructive' : 'text-green-400'}`}>{displayData ? (displayData.wheezing ? "Detected" : "None") : '...'}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <HeartPulse className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="font-medium">Breathing Rate</span>
          </div>
          <span className="text-lg font-semibold">{displayData?.breathingRate ?? '...'} <span className="text-sm font-normal text-muted-foreground">bpm</span></span>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h4 className="font-medium mb-2">Live Cough Analysis</h4>
          <div className="flex items-center gap-4">
             <Button onClick={isRecording ? handleStopRecording : handleStartRecording} disabled={isLoading}>
                {isRecording ? <Square className="mr-2" /> : <Mic className="mr-2" />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          </div>
          {analysis && (
            <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-3 space-y-3">
                <p className="text-sm italic text-foreground">"{analysis.summary}"</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <TestTube className="h-4 w-4 text-cyan-400" />
                    <span>Cough Type:</span>
                  </div>
                  <Badge variant="outline" className="justify-center border-cyan-400/50 text-cyan-400">{analysis.coughType}</Badge>

                  <div className="flex items-center gap-2 font-medium">
                    <ListTree className="h-4 w-4 text-cyan-400" />
                    <span>Attributes:</span>
                  </div>
                  <span className="text-right text-muted-foreground">{analysis.characteristics}</span>
                </div>
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-start justify-between border-t border-white/10 pt-4">
          <div className="flex items-start gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <Lightbulb className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
                <span className="font-medium">Daily Tip</span>
                <p className="text-sm text-muted-foreground">Consider using a humidifier and staying hydrated to soothe your airway.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

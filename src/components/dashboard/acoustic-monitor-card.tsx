
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ear, Waves, HeartPulse, Lightbulb, Mic, Square, Loader2 } from "lucide-react";
import { acousticData } from "@/lib/mock-data";
import { analyzeCough } from "@/ai/flows/analyze-cough";
import type { AcousticData } from "@/lib/types";

export function AcousticMonitorCard() {
  const [displayData, setDisplayData] = useState<AcousticData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Select random data on the client-side to avoid hydration mismatch
    const randomIndex = Math.floor(Math.random() * acousticData.history.length);
    setDisplayData(acousticData.history[randomIndex]);
  }, []);

  const handleStartRecording = async () => {
    setAnalysis("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const result = await analyzeCough({ audioDataUri: base64Audio });
            setAnalysis(result.analysis);
          } catch (error) {
            console.error("Error analyzing cough:", error);
            setAnalysis("Could not analyze cough at this time. Please try again.");
          } finally {
            setIsLoading(false);
            // Stop all tracks on the stream
            stream.getTracks().forEach(track => track.stop());
          }
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setAnalysis("Microphone access was denied. Please allow access to use this feature.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acoustic Monitoring</CardTitle>
        <CardDescription>Overnight audio analysis and live check</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <Waves className="h-5 w-5 text-secondary-foreground" />
            </div>
            <span className="font-medium">Cough Frequency</span>
          </div>
          <span className="text-lg font-semibold">{displayData?.coughFrequency ?? '...'} <span className="text-sm font-normal text-muted-foreground">/hr</span></span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <Ear className="h-5 w-5 text-secondary-foreground" />
            </div>
            <span className="font-medium">Wheeze Detection</span>
          </div>
          <span className={`text-lg font-semibold ${displayData?.wheezing ? 'text-destructive' : 'text-accent'}`}>{displayData ? (displayData.wheezing ? "Detected" : "None") : '...'}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <HeartPulse className="h-5 w-5 text-secondary-foreground" />
            </div>
            <span className="font-medium">Breathing Rate</span>
          </div>
          <span className="text-lg font-semibold">{displayData?.breathingRate ?? '...'} <span className="text-sm font-normal text-muted-foreground">bpm</span></span>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Live Cough Analysis</h4>
          <div className="flex items-center gap-4">
             <Button onClick={isRecording ? handleStopRecording : handleStartRecording} disabled={isLoading}>
                {isRecording ? <Square className="mr-2" /> : <Mic className="mr-2" />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          </div>
          {analysis && (
            <div className="mt-4 rounded-md border bg-muted/50 p-3">
                <p className="text-sm text-foreground">{analysis}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-start justify-between border-t pt-4">
          <div className="flex items-start gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <Lightbulb className="h-5 w-5 text-secondary-foreground" />
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

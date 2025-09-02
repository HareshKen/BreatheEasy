
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Square, Waves, HeartPulse, Ear, AlarmClock, BellOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SleepMonitorCard() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [liveData, setLiveData] = useState({
    coughFrequency: 0,
    breathingRate: 14,
    wheezing: false,
  });
  const [showAlert, setShowAlert] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs only on the client
    audioRef.current = new Audio('/alarm.mp3');
    audioRef.current.loop = true;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        
        // Simulate data fluctuations
        const coughChance = Math.random();
        let newCoughFrequency = liveData.coughFrequency;
        // Increase chance of coughs as time goes on to simulate worsening condition
        if (coughChance < 0.15 + (elapsedTime / 300)) { // 15% base chance, increasing over 5 mins
          newCoughFrequency = Math.min(60, liveData.coughFrequency + Math.floor(Math.random() * 3) + 1);
        }

        const newBreathingRate = 18 + Math.floor(Math.random() * 5); // Simulate elevated breathing rate
        const newWheezing = Math.random() < 0.4; // 40% chance of wheezing

        setLiveData({
          coughFrequency: newCoughFrequency,
          breathingRate: newBreathingRate,
          wheezing: newWheezing,
        });

        // Check for alarm conditions
        if (newCoughFrequency > 40 && newBreathingRate > 20 && newWheezing) {
          setShowAlert(true);
          if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
          }
          toast({
            variant: "destructive",
            title: "High-Risk Event Detected!",
            description: "Significant coughing, wheezing, and high breathing rate detected.",
          });
        }

      }, 2000); // Update every 2 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMonitoring, liveData.coughFrequency, elapsedTime, toast]);

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
        setIsMonitoring(false);
        setElapsedTime(0);
        setLiveData({ coughFrequency: 0, breathingRate: 14, wheezing: false });
        setShowAlert(false);
    } else {
        setIsMonitoring(true);
    }
  };

  const handleStopAlarm = () => {
    setShowAlert(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Card className="shadow-cyan-500/10 hover:shadow-cyan-500/20">
      <CardHeader>
        <CardTitle>Sleep Mode</CardTitle>
        <CardDescription>Activate to monitor respiratory events while you sleep. An alarm will sound if high-risk events are detected.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
           <div className="flex items-center gap-4">
             <Button onClick={handleToggleMonitoring}>
                {isMonitoring ? <Square className="mr-2" /> : <Moon className="mr-2" />}
                {isMonitoring ? 'Stop Sleep Mode' : 'Activate Sleep Mode'}
             </Button>
             {isMonitoring && <div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-primary"/><span className="font-mono text-lg">{formatTime(elapsedTime)}</span></div>}
           </div>
           {showAlert && (
            <Button variant="destructive" onClick={handleStopAlarm}>
              <BellOff className="mr-2" />
              Stop Alarm
            </Button>
           )}
        </div>

        {isMonitoring && (
          <div className={`p-4 rounded-lg border ${showAlert ? 'border-destructive bg-destructive/10' : 'border-border'}`}>
            <h4 className="font-medium mb-3 flex items-center gap-2">
                <AlarmClock className={showAlert ? 'text-destructive' : 'text-primary'} />
                Live Monitoring Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Waves className="h-5 w-5 text-cyan-400" /><span>Cough Freq.</span></div>
                <Badge variant={liveData.coughFrequency > 40 ? "destructive" : "secondary"}>{liveData.coughFrequency} <span className="text-xs font-normal ml-1">/hr</span></Badge>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3"><HeartPulse className="h-5 w-5 text-cyan-400" /><span>Breathing Rate</span></div>
                <Badge variant={liveData.breathingRate > 20 ? "destructive" : "secondary"}>{liveData.breathingRate} <span className="text-xs font-normal ml-1">bpm</span></Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Ear className="h-5 w-5 text-cyan-400" /><span>Wheezing</span></div>
                <Badge variant={liveData.wheezing ? "destructive" : "secondary"}>{liveData.wheezing ? "Detected" : "None"}</Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Square, Waves, HeartPulse, Ear, AlarmClock, BellOff, Loader2, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sendEmergencyAlert } from "@/lib/sos";
import type { SymptomLog } from "@/lib/types";

type SleepSessionLog = {
  startTime: Date;
  duration: number; // in seconds
  totalCoughs: number;
  wheezingDetected: boolean;
};

type SleepMonitorCardProps = {
    riskScore: number;
    symptomLogs: SymptomLog[];
}

export function SleepMonitorCard({ riskScore, symptomLogs }: SleepMonitorCardProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [liveData, setLiveData] = useState({
    coughFrequency: 0,
    breathingRate: 14,
    wheezing: false,
  });
  const [sessionLog, setSessionLog] = useState<SleepSessionLog[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isAutoSosTriggered, setIsAutoSosTriggered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
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
      // Stop media stream if component unmounts
      mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    const handleAutomaticSOS = async () => {
      if (isAutoSosTriggered) return;
      setIsAutoSosTriggered(true);

      toast({
        variant: "destructive",
        title: "AUTOMATIC SOS TRIGGERED",
        description: "Critically high-risk event detected. Sending alert to emergency contacts and your doctor.",
        duration: 10000,
      });

      try {
        await sendEmergencyAlert({ riskScore, symptomLogs });
        // You would also add a call here to notify the doctor
        console.log("Automated doctor alert would be sent here.");
      } catch (error) {
        console.error("Failed to send automated SOS", error);
        toast({
            variant: "destructive",
            title: "Automated SOS Failed",
            description: (error as Error).message,
        });
      }
    };

    if (isMonitoring) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        
        // Simulate data fluctuations
        const coughChance = Math.random();
        let newCoughFrequency = liveData.coughFrequency;
        // Increase likelihood of high values for demonstration
        if (coughChance < 0.25 + (elapsedTime / 180)) { 
          newCoughFrequency = liveData.coughFrequency + 1;
        }

        const newBreathingRate = 18 + Math.floor(Math.random() * 8); // Skew higher
        const newWheezing = liveData.wheezing || Math.random() < 0.5; // Skew towards true

        setLiveData({
          coughFrequency: newCoughFrequency,
          breathingRate: newBreathingRate,
          wheezing: newWheezing,
        });

        // Check for alarm and SOS conditions
        const isCritical = newCoughFrequency > 40 && newBreathingRate > 22 && newWheezing;

        if (isCritical) {
          if (!showAlert) { // Only trigger alarm and toast once
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
          // Trigger automated SOS
          handleAutomaticSOS();
        }
      }, 2000); // Update every 2 seconds
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMonitoring, liveData, elapsedTime, toast, isAutoSosTriggered, riskScore, symptomLogs]);
  
  const handleStartMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      
      setIsMonitoring(true);
      toast({
        title: "Sleep Mode Activated",
        description: "Microphone is on and monitoring has begun.",
      });

    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access microphone. Please grant permission in your browser settings.",
      });
    }
  };

  const handleStopMonitoring = () => {
      // Create and save the log
      const newLog: SleepSessionLog = {
        startTime: new Date(Date.now() - elapsedTime * 1000),
        duration: elapsedTime,
        totalCoughs: liveData.coughFrequency,
        wheezingDetected: liveData.wheezing,
      };
      setSessionLog(prevLogs => [newLog, ...prevLogs]);

      // Stop recording and release microphone
      if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          mediaRecorderRef.current = null;
      }

      // Reset state
      setIsMonitoring(false);
      setElapsedTime(0);
      setLiveData({ coughFrequency: 0, breathingRate: 14, wheezing: false });
      setShowAlert(false);
      setIsAutoSosTriggered(false); // Reset SOS trigger for next session

       toast({
        title: "Sleep Mode Deactivated",
        description: `Session of ${formatTime(elapsedTime)} logged successfully.`,
      });
  };

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      handleStopMonitoring();
    } else {
      handleStartMonitoring();
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
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className="shadow-cyan-500/10 hover:shadow-cyan-500/20">
      <CardHeader>
        <CardTitle>Sleep Mode</CardTitle>
        <CardDescription>Activate to monitor respiratory events while you sleep. An alarm and automated SOS will be triggered if high-risk events are detected.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                <div className="flex items-center gap-3"><Waves className="h-5 w-5 text-cyan-400" /><span>Total Coughs</span></div>
                <Badge variant={liveData.coughFrequency > 40 ? "destructive" : "secondary"}>{liveData.coughFrequency}</Badge>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3"><HeartPulse className="h-5 w-5 text-cyan-400" /><span>Breathing Rate</span></div>
                <Badge variant={liveData.breathingRate > 22 ? "destructive" : "secondary"}>{liveData.breathingRate} <span className="text-xs font-normal ml-1">bpm</span></Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Ear className="h-5 w-5 text-cyan-400" /><span>Wheezing</span></div>
                <Badge variant={liveData.wheezing ? "destructive" : "secondary"}>{liveData.wheezing ? "Detected" : "None"}</Badge>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2"><History /> Session History</h3>
          {sessionLog.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Total Coughs</TableHead>
                    <TableHead className="text-right">Wheezing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionLog.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.startTime.toLocaleString()}</TableCell>
                      <TableCell>{formatTime(log.duration)}</TableCell>
                      <TableCell>{log.totalCoughs}</TableCell>
                      <TableCell className="text-right">{log.wheezingDetected ? "Detected" : "None"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 border rounded-md">
              No sleep sessions logged yet. Activate sleep mode to start monitoring.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

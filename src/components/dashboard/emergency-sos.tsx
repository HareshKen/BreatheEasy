"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Siren, Loader2, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SymptomLog } from "@/lib/types";
import { sendEmergencyAlert } from "@/lib/sos";

type EmergencySOSProps = {
  riskScore: number;
  symptomLogs: SymptomLog[];
};

export function EmergencySOS({ riskScore, symptomLogs }: EmergencySOSProps) {
  const [isSending, setIsSending] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs only on the client
    audioRef.current = new Audio("/fire_alarm.mp3");
    audioRef.current.loop = true;

    return () => {
      // Cleanup audio on component unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSosConfirm = async () => {
    setIsSending(true);

    // 1. Play the alarm immediately on click to satisfy browser policy.
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsAlarmPlaying(true);
      } catch (e) {
        console.error("Error playing audio:", e);
        toast({
          variant: "destructive",
          title: "Could not play alarm sound",
          description: "Please check your browser permissions and volume.",
        });
        setIsSending(false);
        return; // Stop if the audio fails to play
      }
    }

    try {
      // 2. Now, send the alert.
      const result = await sendEmergencyAlert({ riskScore, symptomLogs });
      toast({
        title: "Emergency Alert Sent",
        description: result,
        duration: 8000,
      });
    } catch (error) {
      // 3. If sending fails, stop the alarm and notify the user.
      stopAlarm(); // Stop the sound on failure
      toast({
        variant: "destructive",
        title: "Failed to Send Alert",
        description: (error as Error).message,
      });
    } finally {
      setIsSending(false);
    }
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAlarmPlaying(false);
  };

  const handleCancel = () => {
    if (isAlarmPlaying) {
      stopAlarm();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="lg"
          className="rounded-full h-12 w-36 text-lg shadow-lg animate-pulse"
        >
          <Siren className="mr-2 h-6 w-6" />
          SOS
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Emergency SOS</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately send an alert with your location and recent
            health data to your pre-configured emergency contacts.
            {isAlarmPlaying && (
              <>
                <br />
                <strong className="text-destructive">
                  An audible alarm has been activated.
                </strong>
              </>
            )}
            <br />
            <br />
            <strong className="text-destructive">
              Only use this in a genuine emergency.
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isSending}>
            Cancel
          </AlertDialogCancel>
          {isAlarmPlaying ? (
            <AlertDialogAction
              onClick={stopAlarm}
              className="bg-destructive hover:bg-destructive/90"
            >
              <BellOff className="mr-2" />
              Stop Alarm
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              onClick={handleSosConfirm}
              disabled={isSending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Confirm & Send Alert"
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
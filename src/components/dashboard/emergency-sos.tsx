
"use client";

import { useState } from "react";
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
import { Siren, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SymptomLog } from "@/lib/types";
import { sendEmergencyAlert } from "@/lib/sos";

type EmergencySOSProps = {
  riskScore: number;
  symptomLogs: SymptomLog[];
};

export function EmergencySOS({ riskScore, symptomLogs }: EmergencySOSProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSosConfirm = async () => {
    setIsSending(true);
    try {
      const result = await sendEmergencyAlert({ riskScore, symptomLogs });
      toast({
        title: "Emergency Alert Sent",
        description: result,
        duration: 8000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Send Alert",
        description: (error as Error).message,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="lg" className="rounded-full h-12 w-36 text-lg shadow-lg animate-pulse">
          <Siren className="mr-2 h-6 w-6" />
          SOS
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Emergency SOS</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately send an alert with your location and recent health data to your pre-configured emergency contacts.
            <br /><br />
            <strong className="text-destructive">Only use this in a genuine emergency.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSending}>Cancel</AlertDialogCancel>
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

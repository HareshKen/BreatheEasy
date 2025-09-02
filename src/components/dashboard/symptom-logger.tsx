
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SymptomLog, Trigger } from "@/lib/types";
import { validTriggers } from "@/lib/types";
import { Badge } from "../ui/badge";

type SymptomLoggerProps = {
  addSymptomLog: (log: Omit<SymptomLog, 'dateTime'>) => void;
};

export function SymptomLogger({ addSymptomLog }: SymptomLoggerProps) {
  const [open, setOpen] = useState(false);
  const [phlegmColor, setPhlegmColor] = useState("");
  const [inhalerUsage, setInhalerUsage] = useState("0");
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const { toast } = useToast();

  const handleTriggerToggle = (trigger: Trigger) => {
    setTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!phlegmColor) {
        toast({
            title: "Missing Information",
            description: "Please select a phlegm color.",
            variant: "destructive",
        });
        return;
    }

    addSymptomLog({
        phlegmColor: phlegmColor as SymptomLog['phlegmColor'],
        inhalerUsage: parseInt(inhalerUsage, 10),
        triggers: triggers,
    });

    toast({
      title: "Symptoms Logged",
      description: "Your symptoms have been successfully recorded.",
    });

    // Reset form and close dialog
    setPhlegmColor("");
    setInhalerUsage("0");
    setTriggers([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Log Symptoms
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Log Daily Symptoms</DialogTitle>
            <DialogDescription>
              Record your symptoms, triggers, and inhaler usage for today.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phlegm-color" className="text-right">
                Phlegm Color
              </Label>
              <Select value={phlegmColor} onValueChange={setPhlegmColor}>
                <SelectTrigger id="phlegm-color" className="col-span-3">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clear">Clear</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Yellow">Yellow</SelectItem>
                  <SelectItem value="Green">Green</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="inhaler-usage" className="text-right">
                Inhaler Usage
              </Label>
              <Input
                id="inhaler-usage"
                type="number"
                value={inhalerUsage}
                onChange={(e) => setInhalerUsage(e.target.value)}
                className="col-span-3"
                min="0"
              />
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Triggers
              </Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {validTriggers.map(trigger => (
                   <Button 
                     key={trigger}
                     type="button"
                     variant={triggers.includes(trigger) ? "default" : "outline"}
                     size="sm"
                     onClick={() => handleTriggerToggle(trigger)}
                     className="rounded-full"
                   >
                     {trigger}
                   </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Log</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

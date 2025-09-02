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
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SymptomLogger() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Logic to save symptom data would go here
    toast({
      title: "Symptoms Logged",
      description: "Your symptoms have been successfully recorded.",
    });
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
              Record your symptoms and inhaler usage for today.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phlegm-color" className="text-right">
                Phlegm Color
              </Label>
              <Select>
                <SelectTrigger id="phlegm-color" className="col-span-3">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">Clear</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
                defaultValue="0"
                className="col-span-3"
                min="0"
              />
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


"use client";

import { useState, useRef, useEffect } from "react";
import { chatWithDoctor } from "@/ai/flows/chat-with-doctor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import type { AcousticData, EnvironmentalData, SleepReport, ChatMessage, HealthData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";


type DoctorChatbotProps = {
  riskScore: number;
  acousticData: AcousticData | null;
  environmentalData: EnvironmentalData | null;
  sleepReport: SleepReport | null;
};

export function DoctorChatbot({
  riskScore,
  acousticData,
  environmentalData,
  sleepReport,
}: DoctorChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        scrollAreaRef.current?.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  };
  

  useEffect(() => {
    if (messages.length === 0) {
        setMessages([
            {
                role: "model",
                content: "Hello! I'm your AI Health Assistant. I can see your latest health data. Ask me anything about it, like 'How can I improve my sleep?' or 'What does my risk score mean?'\n\n**Disclaimer:** I am an AI assistant. Please consult a real healthcare professional for medical advice."
            }
        ])
    }
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    
    try {
      const healthData: HealthData = {
        riskScore: riskScore,
        coughFrequency: acousticData?.coughFrequency,
        wheezingDetected: acousticData?.wheezing,
        breathingRate: acousticData?.breathingRate,
        aqi: environmentalData?.aqi,
        pollenCount: environmentalData?.pollen,
        sleepQualityScore: sleepReport?.sleepScore,
      };

      const response = await chatWithDoctor({
        healthData: healthData,
        messages: newMessages,
      });
      const botMessage: ChatMessage = { role: "model", content: response.reply };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Error chatting with doctor AI:", error);
      toast({
        title: "AI Error",
        description: "Could not get a response from the AI assistant. This may be due to API rate limits. Please try again later.",
        variant: "destructive",
      });
       const errorMessage: ChatMessage = { role: "model", content: "Sorry, I'm having trouble connecting right now. Please try again in a moment." };
       setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <CardDescription className="px-1 pb-4">
        Ask questions about your health data and get personalized advice.
      </CardDescription>
      <div className="flex flex-col flex-grow h-[26rem] border rounded-md">
          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "model" && (
                    <Avatar className="h-8 w-8">
                       <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-base whitespace-pre-wrap">{message.content}</p>
                  </div>
                   {message.role === "user" && (
                     <Avatar className="h-8 w-8">
                        <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                     </Avatar>
                   )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-start gap-3">
                   <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></AvatarFallback>
                   </Avatar>
                   <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                   </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-2 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your health data..."
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
    </div>
  );
}

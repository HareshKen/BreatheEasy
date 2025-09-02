
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import type { AcousticData, EnvironmentalData, SleepReport, ChatMessage } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type DoctorChatbotProps = {
  riskScore: number;
  acousticData: AcousticData | null;
  environmentalData: EnvironmentalData | null;
  sleepReport: SleepReport | null;
};

// Mock implementation to avoid API rate limits during development.
const generateMockChatResponse = (
  input: string,
  { riskScore, sleepReport }: DoctorChatbotProps
): string => {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("sleep")) {
    if (!sleepReport) {
      return "I don't have your latest sleep report yet. Please generate it first, and then I can give you some advice!";
    }
    if (sleepReport.sleepScore > 80) {
      return `That's great to hear you're focusing on sleep! Your last sleep score was ${sleepReport.sleepScore}, which is excellent. Keep up the great work with your consistent sleep schedule and relaxing bedtime routine.`;
    }
    if (sleepReport.sleepScore < 50) {
      return `Improving sleep is a great goal, especially since your last score was ${sleepReport.sleepScore}. To help improve it, I recommend establishing a consistent sleep schedule, even on weekends, and creating a relaxing bedtime routine, like reading or listening to calm music.`;
    }
    return `Your last sleep score was ${sleepReport.sleepScore}, which is a good start. To improve it further, try to avoid screens an hour before bed and ensure your bedroom is dark and quiet.`;
  }

  if (lowerInput.includes("risk score") || lowerInput.includes("risk")) {
    if (riskScore > 66) {
      return `I see your risk score is currently high at ${riskScore}. This is likely due to recent symptom logs. I recommend using your rescue inhaler as prescribed, avoiding strenuous activities, and monitoring your symptoms closely. Please contact your doctor if they worsen.`;
    }
    if (riskScore > 33) {
      return `Your risk score is moderate right now, at ${riskScore}. This is a good time to be mindful of environmental triggers like high pollen or poor air quality. Ensure you're consistent with your daily medication.`;
    }
    return `Your risk score is low at ${riskScore}, which is great news! It seems your current plan is working well. Continue to monitor your symptoms and stick to your routine.`;
  }

  if (lowerInput.includes("eat") || lowerInput.includes("diet") || lowerInput.includes("food")) {
    return "A healthy diet can certainly help manage your condition. I suggest focusing on anti-inflammatory foods like leafy greens, berries, and fatty fish. It's also wise to stay hydrated and limit processed foods and excessive salt, which can sometimes contribute to breathing difficulties.";
  }

  return "That's a great question. Based on your current health data, I would recommend that you continue to monitor your symptoms closely. If you notice any significant changes, it's always best to consult with your healthcare provider. Remember to stay hydrated and get plenty of rest.";
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
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    // Add initial greeting from the bot
    if (messages.length === 0) {
        setMessages([
            {
                role: "model",
                content: "Hello! I'm your AI Health Assistant. I can see your latest health data. Ask me anything about it, like 'How can I improve my sleep?' or 'What does my risk score mean?'\n\n**Disclaimer:** I am an AI assistant. Please consult a real healthcare professional for medical advice."
            }
        ])
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const response = { reply: generateMockChatResponse(currentInput, { riskScore, acousticData, environmentalData, sleepReport }) };
      const botMessage: ChatMessage = { role: "model", content: response.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error chatting with mock doctor AI:", error);
      toast({
        title: "Error",
        description: "Could not get a response from the AI assistant. Please try again.",
        variant: "destructive",
      });
       const errorMessage: ChatMessage = { role: "model", content: "Sorry, I'm having trouble connecting right now. Please try again in a moment." };
       setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-cyan-500/10 hover:shadow-cyan-500/20 col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI Health Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about your health data and get personalized advice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-96">
          <ScrollArea className="flex-grow p-4 border rounded-md" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="mx-auto h-12 w-12" />
                  <p className="mt-2">I'm here to help. Ask me anything about your health summary!</p>
                </div>
              )}
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
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can I improve my sleep quality?"
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

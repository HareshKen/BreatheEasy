
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Wind, Leaf, Loader2, AlertTriangle, Thermometer, Droplets, Gauge } from "lucide-react";
import { fetchWeatherData } from "@/ai/tools/weather";
import type { EnvironmentalData } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type EnvironmentCardProps = {
  onDataFetched: (data: EnvironmentalData | null) => void;
  onLoadingChange: (isLoading: boolean) => void;
};

export function EnvironmentCard({ onDataFetched, onLoadingChange }: EnvironmentCardProps) {
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    const fetchEnvData = () => {
      setIsLoading(true);
      setError(null);
      
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        setIsLoading(false);
        onDataFetched(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const result = await fetchWeatherData(latitude, longitude);
          const fetchedData: EnvironmentalData = {
            location: result.locationName,
            aqi: result.aqi,
            pollutants: {
                pm25: result.pm25,
                ozone: result.ozone,
                so2: result.so2,
                no2: result.no2,
            },
            pollen: result.pollen,
            temperature: result.temperature,
            humidity: result.humidity,
          }
          setData(fetchedData);
          onDataFetched(fetchedData);
        } catch (e) {
          console.error("Error fetching environmental data:", e);
          setError("Could not retrieve environmental data at this time. Please try again.");
          onDataFetched(null);
        } finally {
          setIsLoading(false);
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        setError("Could not get location. Please enable location services.");
        setIsLoading(false);
        onDataFetched(null);
      });
    };

    fetchEnvData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDataFetched]);

  const getPollutantInfo = (type: 'pm25' | 'ozone' | 'so2' | 'no2', value: number) => {
    // Simplified scale for demonstration
    if (type === 'pm25') {
        if (value <= 12) return { label: 'Good', color: 'text-accent' };
        if (value <= 35) return { label: 'Moderate', color: 'text-yellow-500' };
        return { label: 'Unhealthy', color: 'text-destructive' };
    }
    // Add similar scales for other pollutants if needed
    if (value < 50) return { label: 'Good', color: 'text-accent' };
    if (value < 100) return { label: 'Moderate', color: 'text-yellow-500' };
    return { label: 'High', color: 'text-destructive' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Factors</CardTitle>
        <CardDescription>
          {isLoading ? "Fetching real-time data..." : data ? `Real-time data for ${data.location}` : "Could not fetch data"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
           <div className="flex items-center gap-3 rounded-md border border-destructive/50 bg-destructive/10 p-3">
             <AlertTriangle className="h-5 w-5 text-destructive" />
             <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md">
                  <Leaf className="h-5 w-5 text-secondary-foreground" />
                </div>
                <span className="font-medium">Pollen Count</span>
              </div>
              <span className="text-lg font-semibold">{data.pollen}</span>
            </div>
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md">
                  <Thermometer className="h-5 w-5 text-secondary-foreground" />
                </div>
                <span className="font-medium">Temperature</span>
              </div>
              <span className="text-lg font-semibold">{data.temperature}°C</span>
            </div>
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md">
                  <Droplets className="h-5 w-5 text-secondary-foreground" />
                </div>
                <span className="font-medium">Humidity</span>
              </div>
              <span className="text-lg font-semibold">{data.humidity}%</span>
            </div>
          </div>
        ) : null}
      </CardContent>
      {data && (
        <CardFooter className="flex flex-col items-start gap-4 border-t pt-4">
            <h4 className="font-medium">Specific Pollutants</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 text-center">
                 {(Object.keys(data.pollutants) as Array<keyof typeof data.pollutants>).map(key => {
                     const value = data.pollutants[key];
                     const { label, color } = getPollutantInfo(key, value);
                     return (
                       <TooltipProvider key={key}>
                        <Tooltip>
                         <TooltipTrigger asChild>
                           <div className="flex flex-col items-center p-2 rounded-md bg-muted/50 gap-1 cursor-help">
                              <span className="text-xs font-bold uppercase text-muted-foreground">{key}</span>
                              <span className={`text-xl font-bold ${color}`}>{value}</span>
                              <span className={`text-xs font-medium ${color}`}>{label}</span>
                           </div>
                         </TooltipTrigger>
                          <TooltipContent>
                             <p>{key.toUpperCase()} level is currently {label.toLowerCase()}.</p>
                          </TooltipContent>
                         </Tooltip>
                       </TooltipProvider>
                     );
                 })}
            </div>
        </CardFooter>
      )}
    </Card>
  );
}

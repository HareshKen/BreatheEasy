
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wind, Leaf, Loader2, AlertTriangle, Thermometer, Droplets } from "lucide-react";
import { fetchWeatherData } from "@/ai/tools/weather";
import type { EnvironmentalData } from "@/lib/types";

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

  const getAqiColor = (value: number) => {
    if (value <= 50) return "text-accent"; // Good
    if (value <= 100) return "text-yellow-500"; // Moderate
    if (value <= 150) return "text-orange-500"; // Unhealthy for Sensitive Groups
    return "text-destructive"; // Unhealthy
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
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md">
                  <Wind className="h-5 w-5 text-secondary-foreground" />
                </div>
                <span className="font-medium">Air Quality Index (AQI)</span>
              </div>
              <span className={`text-lg font-semibold ${getAqiColor(data.aqi)}`}>{data.aqi}</span>
            </div>
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
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

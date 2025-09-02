"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wind, Leaf, Loader2, AlertTriangle } from "lucide-react";

type EnvironmentalData = {
  aqi: number;
  pollen: 'Low' | 'Moderate' | 'High';
  location: string;
};

export function EnvironmentCard() {
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRealTimeData = (position: GeolocationPosition) => {
      // In a real application, you would use the coordinates to call a weather/AQI API.
      // For this demo, we will simulate an API call with mock data.
      console.log("Fetching data for:", position.coords.latitude, position.coords.longitude);
      
      // Simulating API call
      setTimeout(() => {
        setData({
          aqi: Math.floor(Math.random() * 200) + 1, // Random AQI from 1 to 200
          pollen: ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Moderate' | 'High',
          location: "Your Current Location"
        });
        setIsLoading(false);
      }, 1500);
    };

    const handleError = (error: GeolocationPositionError) => {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          setError("Location access was denied. Please enable it in your browser settings.");
          break;
        case error.POSITION_UNAVAILABLE:
          setError("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          setError("The request to get user location timed out.");
          break;
        default:
          setError("An unknown error occurred while fetching location.");
          break;
      }
      setIsLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchRealTimeData, handleError);
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

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
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

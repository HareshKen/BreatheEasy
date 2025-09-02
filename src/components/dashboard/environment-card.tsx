import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wind, Leaf } from "lucide-react";
import { environmentalData } from "@/lib/mock-data";

export function EnvironmentCard() {
  const { aqi, pollen, location } = environmentalData.today;

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
        <CardDescription>Real-time data for {location}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <Wind className="h-5 w-5 text-secondary-foreground" />
            </div>
            <span className="font-medium">Air Quality Index (AQI)</span>
          </div>
          <span className={`text-lg font-semibold ${getAqiColor(aqi)}`}>{aqi}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-md">
              <Leaf className="h-5 w-5 text-secondary-foreground" />
            </div>
            <span className="font-medium">Pollen Count</span>
          </div>
          <span className="text-lg font-semibold">{pollen}</span>
        </div>
      </CardContent>
    </Card>
  );
}

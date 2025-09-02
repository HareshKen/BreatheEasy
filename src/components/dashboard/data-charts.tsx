
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Bar, ResponsiveContainer } from "recharts"
import { riskScores as mockRiskScores, acousticData, environmentalData } from "@/lib/mock-data"
import type { DailyData } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

const historyData: DailyData[] = mockRiskScores.history.map((rs, index) => ({
  date: rs.date,
  riskScore: rs.score,
  coughFrequency: acousticData.history[index % acousticData.history.length]?.coughFrequency,
  aqi: environmentalData.history[index]?.aqi,
}));

const chartConfig = {
  riskScore: {
    label: "Risk Score",
    color: "hsl(var(--destructive))",
  },
  coughFrequency: {
    label: "Cough Freq.",
    color: "hsl(var(--primary))",
  },
  aqi: {
    label: "AQI",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

type DataChartsProps = {
  riskScore: number;
  aqi?: number;
  isLoading: boolean;
};

export function DataCharts({ riskScore, aqi, isLoading }: DataChartsProps) {
  const today = new Date().toISOString().split('T')[0];

  // Filter out today's date from the historical data to avoid duplication
  const filteredHistory = historyData.filter(d => d.date !== today);

  const chartData = [
    ...filteredHistory,
    {
      date: today,
      riskScore: riskScore, // Use the live risk score
      coughFrequency: acousticData.today.coughFrequency,
      aqi: aqi, // Use the live aqi
    }
  ];

  return (
    <Card className="shadow-cyan-500/10 hover:shadow-cyan-500/20">
      <CardHeader>
        <CardTitle>Historical Trends</CardTitle>
        <CardDescription>View your risk score, symptoms, and environmental factors including today.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer>
              <ComposedChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 20,
                  left: -10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                      const date = new Date(value);
                      // Adding a check to avoid invalid date formatting
                      if (isNaN(date.getTime())) return "";
                      // Coerce to local timezone to avoid date shifting
                      const localDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
                      if (localDate.toISOString().split('T')[0] === today) return "Today";
                      return localDate.toLocaleString('en-US', { day: 'numeric', month: 'short' })
                  }}
                />
                <YAxis yAxisId="left" domain={[0, 180]} hide />
                <YAxis yAxisId="right" orientation="right" domain={[0, 40]} hide />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar yAxisId="left" dataKey="aqi" fill="var(--color-aqi)" radius={4} barSize={20} opacity={0.3} />
                <Line yAxisId="left" type="monotone" dataKey="riskScore" stroke="var(--color-riskScore)" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                <Line yAxisId="right" type="monotone" dataKey="coughFrequency" stroke="var(--color-coughFrequency)" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

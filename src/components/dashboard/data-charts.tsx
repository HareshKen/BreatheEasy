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
import { riskScores, acousticData, environmentalData } from "@/lib/mock-data"
import { DailyData } from "@/lib/types"

const chartData: DailyData[] = riskScores.history.map((rs, index) => ({
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

export function DataCharts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Trends</CardTitle>
        <CardDescription>View your risk score, symptoms, and environmental factors over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
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
                tickFormatter={(value) => new Date(value).toLocaleString('en-US', { day: 'numeric', month: 'short' })}
              />
              <YAxis yAxisId="left" domain={[0, 180]} hide />
              <YAxis yAxisId="right" orientation="right" domain={[0, 35]} hide />
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
      </CardContent>
    </Card>
  )
}

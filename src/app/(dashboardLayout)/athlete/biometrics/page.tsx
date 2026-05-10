"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useGetBiometricsHistoryQuery } from "@/features/biometrics/biometricsApi";
import Loader from "@/components/shared/Loader";

export default function BiometricsPage() {
  const { data: response, isLoading, error } = useGetBiometricsHistoryQuery(30);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Transform API data for recharts
  const chartData =
    response?.data?.map((entry: any) => ({
      date: formatDate(entry.date),
      weight: entry.weight,
      rawDate: entry.date,
    })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Biometrics Analytics</h1>
          <Card className="p-8">
            <Loader />
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Biometrics Analytics</h1>
          <Card className="p-8 border-destructive/50 bg-destructive/10">
            <p className="text-destructive font-semibold">
              Failed to load biometrics data. Please try again later.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Biometrics Analytics</h1>
          <p className="text-muted-foreground">
            Track your weight over the last 30 days
          </p>
        </div>

        <Card className="p-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--muted-foreground) / 0.2)"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Weight (kg)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value) => [`${value} kg`, "Weight"]}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {chartData.length === 0 && (
          <Card className="p-8 mt-6 text-center">
            <p className="text-muted-foreground">
              No biometrics data available for the last 30 days.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useGetAthleteAnalyticsQuery } from "@/features/athlete/athleteApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, BarChart3 } from "lucide-react";

export default function AthleteAnalytics({ athleteId }: { athleteId: string }) {
  // 🛠️ The component fetches its own data!
  const { data: analyticsResponse, isLoading } =
    useGetAthleteAnalyticsQuery(athleteId);

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // 🛠️ Safely grab the data whether RTK Query unwrapped it or not
  const analytics = analyticsResponse?.volumeHistory
    ? analyticsResponse
    : analyticsResponse?.data;

  return (
    <div className="space-y-6">
      {/* 1. Total Volume Chart */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="border-b border-slate-800/50 pb-4">
          <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Volume Load History (Sets × Reps × Weight)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!analytics?.volumeHistory || analytics.volumeHistory.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              Not enough data to graph volume yet.
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.volumeHistory}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      color: "#f8fafc",
                    }}
                    itemStyle={{ color: "#3b82f6" }}
                  />
                  <Bar
                    dataKey="volume"
                    name="Volume (lbs)"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Estimated 1RM Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analytics?.strengthTrends &&
        Object.keys(analytics.strengthTrends).length > 0 ? (
          Object.entries(analytics.strengthTrends).map(
            ([exerciseName, trendData]: [string, any]) => (
              <Card
                key={exerciseName}
                className="bg-slate-900 border-slate-800"
              >
                <CardHeader className="border-b border-slate-800/50 pb-4">
                  <CardTitle className="text-md text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    {exerciseName} (Est. 1RM)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#1e293b"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          domain={["auto", "auto"]}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#1e293b",
                            color: "#f8fafc",
                          }}
                          itemStyle={{ color: "#10b981" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="max1RM"
                          name="Est. Max (lbs)"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", r: 4, strokeWidth: 0 }}
                          activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ),
          )
        ) : (
          <div className="col-span-full text-center text-slate-500 py-8 bg-slate-900 border border-slate-800 rounded-xl">
            Not enough strength data to calculate 1RM trends yet.
          </div>
        )}
      </div>
    </div>
  );
}

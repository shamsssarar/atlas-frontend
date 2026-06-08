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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, BrainCircuit, Moon, Activity, Scale } from "lucide-react";

// 🛠️ Import your mutations (Adjust import paths based on your actual file structure)
import { useGetBiometricsHistoryQuery } from "@/features/biometrics/biometricsApi";
// import { useLogBiometricsMutation } from "@/features/biometrics/biometricsApi";
// import { useGenerateFatigueMutation } from "@/features/aiInsight/aiApi";

export default function BiometricsPage() {
  const { data: response, isLoading, error } = useGetBiometricsHistoryQuery(30);

  // 🛠️ 1. Setup the Mutations
  // const [logBiometrics] = useLogBiometricsMutation();
  // const [generateFatigue, { isLoading: isGeneratingFatigue }] = useGenerateFatigueMutation();
  const isGeneratingFatigue = false; // Mocking loading state until you uncomment above

  // 🛠️ 2. Setup Daily Check-In State
  const [sleepHours, setSleepHours] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [stress, setStress] = useState("");
  const [weight, setWeight] = useState("");

  const handleDailyCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      /* // STEP 1: Save the raw numbers to the Postgres Database
      await logBiometrics({
        sleepHours: parseFloat(sleepHours),
        sleepQuality: parseInt(sleepQuality, 10),
        subjectiveStress: parseInt(stress, 10),
        weight: parseFloat(weight)
      }).unwrap();

      // STEP 2: Trigger the Physiologist AI! 
      // It will read the DB row we just saved and calculate the CNS Readiness
      const aiResult = await generateFatigue().unwrap();
      
      toast.success("Morning Check-In Complete! AI has analyzed your CNS.");
      */

      // Temporary mock success for UI testing
      toast.success("Mock: Biometrics saved & AI Fatigue Generated!");

      // Clear form
      setSleepHours("");
      setSleepQuality("");
      setStress("");
      setWeight("");
    } catch (err: any) {
      toast.error(err.message || "Failed to log daily readiness.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const chartData =
    response?.data?.map((entry: any) => ({
      date: formatDate(entry.date),
      weight: entry.weight,
      rawDate: entry.date,
    })) || [];

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Readiness & Biometrics</h1>
          <p className="text-slate-400">
            Log your daily metrics to calibrate the AI, then track your history.
          </p>
        </div>

        {/* 🛠️ THE NEW PHYSIOLOGIST AI TRIGGER FORM */}
        <Card className="bg-slate-900 border-slate-800 shadow-lg">
          <CardHeader className="border-b border-slate-800/50 pb-4">
            <CardTitle className="text-xl flex items-center gap-2 text-slate-100">
              <BrainCircuit className="w-5 h-5 text-purple-400" />
              Morning Check-In
            </CardTitle>
            <CardDescription className="text-slate-400">
              Submit these numbers to generate today's AI Fatigue Score.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleDailyCheckIn} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-blue-400" /> Sleep Hours
                  </Label>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 7.5"
                    required
                    className="bg-slate-950 border-slate-700 focus-visible:ring-purple-500"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-400" /> Sleep Quality
                    (1-10)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="e.g. 8"
                    required
                    className="bg-slate-950 border-slate-700 focus-visible:ring-purple-500"
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-400" /> Life Stress
                    (1-10)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="e.g. 4"
                    required
                    className="bg-slate-950 border-slate-700 focus-visible:ring-purple-500"
                    value={stress}
                    onChange={(e) => setStress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-400" /> Bodyweight
                    (lbs)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 185.5"
                    required
                    className="bg-slate-950 border-slate-700 focus-visible:ring-purple-500"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isGeneratingFatigue}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full md:w-auto"
                >
                  {isGeneratingFatigue ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Analyzing CNS...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="w-4 h-4 mr-2" /> Log & Run AI
                      Analysis
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* HISTORICAL CHART */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            30-Day Weight Trend
          </h2>
          {chartData.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
              No biometrics data available for the last 30 days.
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                    itemStyle={{ color: "#3b82f6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    name="Weight (lbs)"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

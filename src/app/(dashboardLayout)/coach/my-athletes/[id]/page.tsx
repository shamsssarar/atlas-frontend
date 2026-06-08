"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAthleteOverviewQuery,
  useGetAthleteWorkoutsQuery,
} from "@/features/athlete/athleteApi";
import AthleteAnalytics from "@/components/coach/AthleteAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Loader2,
  Moon,
  Scale,
  ActivitySquare,
  Dumbbell,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function AthleteCommandCenter() {
  const params = useParams();
  const router = useRouter();
  const athleteId = params.id as string;

  // Fetch Overview Data
  const { data, isLoading, error } = useGetAthleteOverviewQuery(athleteId);
  // 🛠️ 3. Fetch Workout Logs
  const {
    data: workoutsResponse,
    isLoading: isLoadingWorkouts,
    error: workoutsError,
  } = useGetAthleteWorkoutsQuery(athleteId);

  // Combined Loading State
  if (isLoading || isLoadingWorkouts) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col h-[calc(100vh-100px)] items-center justify-center text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-500">Athlete Not Found</h2>
        <p className="text-slate-400">
          This athlete is not actively enrolled in your programs.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/coach/my-athletes")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roster
        </Button>
      </div>
    );
  }

  const { athlete, enrollment, readiness, activityFeed } = data;
  const workouts = Array.isArray(workoutsResponse)
    ? workoutsResponse
    : workoutsResponse?.data || []; // Extract workouts array
  if (workoutsError) {
    console.error(
      "Ledger API Error: Your backend route might be returning a 404.",
      workoutsError,
    );
  }
  const progressPercentage =
    enrollment.totalDays > 0
      ? Math.min(
          Math.round((enrollment.completedDays / enrollment.totalDays) * 100),
          100,
        )
      : 0;

  // Traffic Light Logic
  const isReadinessGood = readiness.status === "ON_TRACK";
  const isReadinessWarning = readiness.status === "NEEDS_REVIEW";
  const isReadinessDanger = readiness.status === "SLIPPING";

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
      {/* 1. ATHLETE HEADER & ENROLLMENT (Always Visible) */}
      <div className="flex flex-col space-y-4">
        <Link
          href="/coach/my-athletes"
          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Athletes
        </Link>

        <Card className="bg-slate-900 border-slate-800 shadow-lg">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-2 border-slate-700">
                <AvatarImage src={athlete.avatarUrl} />
                <AvatarFallback className="bg-slate-800 text-slate-300 text-2xl">
                  {athlete.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-slate-50">
                  {athlete.name}
                </h1>
                <p className="text-slate-400">{athlete.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
                    {enrollment.programName}
                  </Badge>
                  <Badge
                    variant={
                      enrollment.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {enrollment.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Program Progress</span>
                <span className="font-medium text-slate-100">
                  {progressPercentage}%
                </span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2 bg-slate-800 indicator-blue-500"
              />
              <p className="text-xs text-slate-500 text-right">
                {enrollment.completedDays} of {enrollment.totalDays} Days
                Completed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🛠️ 4. THE TAB SYSTEM */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 mb-6 ">
          <TabsTrigger className="text-white" value="overview">
            Command Center
          </TabsTrigger>
          <TabsTrigger className="text-white" value="ledger">
            Workout Ledger
          </TabsTrigger>
          <TabsTrigger className="text-white" value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: COMMAND CENTER (Readiness & Feed) */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ActivitySquare className="w-5 h-5 text-blue-400" /> Readiness
                  (Last 7 Days)
                </h2>
                {isReadinessDanger && (
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1">
                    <AlertTriangle className="w-4 h-4 mr-2" /> CNS Fatigue Risk
                  </Badge>
                )}
                {isReadinessGood && (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Primed to Train
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card
                  className={`bg-slate-900 border ${isReadinessWarning || isReadinessDanger ? "border-orange-500/50" : "border-slate-800"}`}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-400">
                          Avg. Sleep
                        </p>
                        <p
                          className={`text-3xl font-bold ${isReadinessDanger ? "text-red-400" : "text-slate-50"}`}
                        >
                          {readiness.averageSleepLast7Days}{" "}
                          <span className="text-lg text-slate-500 font-normal">
                            hrs
                          </span>
                        </p>
                      </div>
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <Moon className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-400">
                          Latest Bodyweight
                        </p>
                        <p className="text-3xl font-bold text-slate-50">
                          {readiness.latestBodyweight || "--"}{" "}
                          <span className="text-lg text-slate-500 font-normal">
                            lbs
                          </span>
                        </p>
                      </div>
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <Scale className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-400">
                          Latest Stress
                        </p>
                        <p className="text-3xl font-bold text-slate-50">
                          {readiness.latestStress || "--"}{" "}
                          <span className="text-lg text-slate-500 font-normal">
                            /10
                          </span>
                        </p>
                      </div>
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <ActivitySquare className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-bg-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-400" /> Recent
                Activity
              </h2>
              <Card className="bg-slate-900 border-slate-800 h-[300px] overflow-y-auto">
                <CardContent className="p-0">
                  {activityFeed.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500">
                      <ClipboardList className="w-8 h-8 mb-2 opacity-50" />
                      <p>No recent activity recorded.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800/50">
                      {activityFeed.map((item: any) => (
                        <div
                          key={item.id}
                          className="p-4 hover:bg-slate-800/50 transition-colors flex items-start gap-4"
                        >
                          <div
                            className={`p-2 rounded-full mt-1 ${item.type === "WORKOUT" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"}`}
                          >
                            {item.type === "WORKOUT" ? (
                              <Dumbbell className="w-4 h-4" />
                            ) : (
                              <Scale className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(item.date).toLocaleDateString()} at{" "}
                              {new Date(item.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 🛠️ TAB 2: WORKOUT LEDGER */}
        <TabsContent value="ledger" className="space-y-6 mt-6">
          {workouts.length === 0 ? (
            <Card className="bg-slate-900 border-slate-800 p-12 text-center text-slate-400">
              This athlete hasn't completed any workouts yet.
            </Card>
          ) : (
            workouts.map((workout: any) => (
              <Card
                key={workout.id}
                className="bg-slate-900 border-slate-800 overflow-hidden"
              >
                <CardHeader className="bg-slate-800/50 border-b border-slate-800 pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      {workout.focus || workout.name}{" "}
                      {workout.programDay
                        ? `(Day ${workout.programDay.dayNumber})`
                        : ""}
                    </CardTitle>
                    <span className="text-sm font-medium text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                      {new Date(workout.date).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="divide-y divide-slate-800/50">
                    {workout.workoutExercises.map((we: any) => (
                      <div key={we.id} className="p-6">
                        <h4 className="text-md font-semibold text-blue-400 mb-4 flex items-center gap-2">
                          <Dumbbell className="w-4 h-4" /> {we.exercise.name}
                        </h4>

                        {/* The Sets Table Header */}
                        <div className="grid grid-cols-4 gap-4 text-xs tracking-wider uppercase font-semibold text-slate-500 mb-2 px-2">
                          <div>Set</div>
                          <div>Reps</div>
                          <div>Weight</div>
                          <div>Notes</div>
                        </div>

                        {/* The Sets Rows */}
                        <div className="space-y-2">
                          {we.sets.map((set: any) => (
                            <div
                              key={set.id}
                              className="grid grid-cols-4 gap-4 text-sm text-slate-200 bg-slate-950/50 p-3 rounded-md items-center border border-slate-800/50"
                            >
                              <div className="font-medium text-slate-400">
                                Set {set.setNumber}
                              </div>
                              <div>{set.reps}</div>
                              <div className="font-bold text-slate-50">
                                {set.weight}{" "}
                                <span className="text-xs text-slate-500 font-normal">
                                  lbs
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 truncate">
                                {set.notes || "--"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <AthleteAnalytics athleteId={athleteId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

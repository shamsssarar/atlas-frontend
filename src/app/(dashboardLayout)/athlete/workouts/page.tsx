"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 🛠️ Added Tabs
import {
  Dumbbell,
  Sparkles,
  Target,
  Info,
  CheckCircle,
  Loader2,
  CalendarDays,
} from "lucide-react";
import {
  useGenerateNextWorkoutMutation,
  useStartWorkoutMutation,
  useAddExerciseToWorkoutMutation,
  useLogSetMutation,
  useGetTodayPrescriptionQuery,
  useGetMyWorkoutsHistoryQuery,
  useCompleteWorkoutSessionMutation, // 🛠️ Added History Query
} from "@/features/workouts/workoutApi";

interface Exercise {
  exerciseId?: string;
  exerciseName: string;
  targetSets: number;
  targetReps: number | string;
  recommendedWeight: number;
  overloadRationale: string;
}

interface WorkoutPlan {
  programDayId?: string;
  data?: Exercise[];
}

interface LoggedSet {
  reps: string;
  weight: string;
}

export default function WorkoutsPage() {
  const router = useRouter();

  // Queries
  const { data: prescribedResponse, isLoading: isLoadingPrescription } =
    useGetTodayPrescriptionQuery();
  const { data: historyResponse, isLoading: isLoadingHistory } =
    useGetMyWorkoutsHistoryQuery();

  // Mutations
  const [generateNextWorkout, { isLoading: isGeneratingAI }] =
    useGenerateNextWorkoutMutation();
  const [completeWorkoutSession] = useCompleteWorkoutSessionMutation();

  // State
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(
    null,
  );
  const [isLogging, setIsLogging] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [hasFinishedToday, setHasFinishedToday] = useState(false);
  const [workoutLogs, setWorkoutLogs] = useState<Record<number, LoggedSet[]>>(
    {},
  );
  const [showToast, setShowToast] = useState(false);

  // Logic
  const prescribedWorkout =
    prescribedResponse?.data && !hasFinishedToday ? prescribedResponse : null;
  const activeWorkout = prescribedWorkout || generatedWorkout;
  const workoutHistory = Array.isArray(historyResponse)
    ? historyResponse
    : historyResponse?.data || [];

  const handleGenerateWorkout = async () => {
    try {
      const result = (await generateNextWorkout().unwrap()) as WorkoutPlan;
      setGeneratedWorkout(result);
    } catch (error) {
      console.error("Failed to generate workout:", error);
    }
  };

  const handleDiscard = () => {
    setGeneratedWorkout(null);
  };

  const handleStartWorkout = () => {
    if (!activeWorkout?.data) return;
    const initialLogs: Record<number, LoggedSet[]> = {};
    activeWorkout.data.forEach((exercise: Exercise, index: number) => {
      initialLogs[index] = Array(exercise.targetSets).fill({
        reps: "",
        weight: "",
      });
    });
    setWorkoutLogs(initialLogs);
    setIsLogging(true);
  };

  const handleLogChange = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: string,
  ) => {
    setWorkoutLogs((prev) => {
      const updatedExerciseLogs = [...(prev[exerciseIndex] || [])];
      updatedExerciseLogs[setIndex] = {
        ...updatedExerciseLogs[setIndex],
        [field]: value,
      };
      return { ...prev, [exerciseIndex]: updatedExerciseLogs };
    });
  };

  const handleFinishWorkout = async () => {
    if (!activeWorkout?.data) return;

    setIsCompleting(true);

    try {
      // 1. DATA PREPARATION: Bundle the entire workout into a single JSON payload
      const sessionPayload = {
        name: prescribedWorkout
          ? "Coach Prescribed Workout"
          : "AI Generated Workout",
        focus: prescribedWorkout ? "Coach Program" : "AI Prescribed",
        programDayId: activeWorkout.programDayId,

        exercises: activeWorkout.data.map(
          (exercise: Exercise, index: number) => {
            const rawLogs = workoutLogs[index] || [];

            // Filter out any empty sets the athlete skipped or left blank
            const validSets = rawLogs.filter(
              (log) => log.reps !== "" && log.weight !== "",
            );

            return {
              exerciseId: exercise.exerciseId,
              exerciseName: exercise.exerciseName,
              targetSets: exercise.targetSets,
              targetReps: exercise.targetReps,
              recommendedWeight: exercise.recommendedWeight,
              order: index,

              // Transform the string inputs into pure numbers for the database
              sets: validSets.map((log, setIndex) => ({
                setNumber: setIndex + 1,
                reps: parseInt(log.reps, 10) || 0,
                weight: parseFloat(log.weight) || 0,
              })),
            };
          },
        ),
      };

      // 2. EXECUTION: Send the single, atomic request to the backend
      await completeWorkoutSession(sessionPayload).unwrap();
      setHasFinishedToday(true);

      // 3. UI CLEANUP: Show success and reset state
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        // Staying on the page so the athlete can click the "Training History" tab to see it!
      }, 3000);

      setIsLogging(false);
      setGeneratedWorkout(null);
      setWorkoutLogs({});
    } catch (error) {
      console.error("Failed to batch save workout:", error);
      alert(
        "Failed to save workout. Please check your connection and try again.",
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCancelWorkout = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All logged progress will be lost.",
      )
    ) {
      setIsLogging(false);
      setWorkoutLogs({});
    }
  };

  if (isLoadingPrescription || isLoadingHistory) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 relative">
      <div className="max-w-6xl mx-auto pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Training Hub</h1>
          <p className="text-muted-foreground">
            View your daily prescribed plan or review your past performances.
          </p>
        </div>

        {/* 🛠️ THE TABS SYSTEM */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800 mb-6">
            <TabsTrigger value="today">Today's Plan</TabsTrigger>
            <TabsTrigger value="history">Training History</TabsTrigger>
          </TabsList>

          {/* TAB 1: TODAY'S PLAN */}
          <TabsContent value="today" className="space-y-6">
            {!activeWorkout ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Card className="border-dashed border-2 p-8 text-center max-w-md">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">All Caught Up!</h2>
                  <p className="text-muted-foreground mb-6">
                    You have no pending prescribed workouts from your coach for
                    today. You can rest, or generate a custom AI session.
                  </p>
                  <Button
                    onClick={handleGenerateWorkout}
                    disabled={isGeneratingAI}
                    size="lg"
                    className="w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGeneratingAI
                      ? "Analyzing CNS & Generating..."
                      : "Generate AI Workout"}
                  </Button>
                </Card>
              </div>
            ) : !isLogging ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  {prescribedWorkout
                    ? `Prescribed Workout (Day ${prescribedWorkout.dayNumber})`
                    : "AI Generated Workout"}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeWorkout.data?.map(
                    (exercise: Exercise, index: number) => (
                      <Card
                        key={index}
                        className="flex flex-col border border-border"
                      >
                        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-primary" />
                            {exercise.exerciseName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 flex-grow flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Target className="w-4 h-4" />
                              <span className="font-medium text-foreground">
                                {exercise.targetSets} sets ×{" "}
                                {exercise.targetReps} reps
                              </span>
                            </div>
                            <div className="text-xl font-bold">
                              @{" "}
                              {exercise.recommendedWeight > 0
                                ? `${exercise.recommendedWeight} lbs`
                                : "Self-Selected"}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-muted/30 pt-3 pb-3 text-xs text-muted-foreground flex items-start gap-2">
                          <Info className="w-4 h-4 mt-0.5 shrink-0" />
                          <p>{exercise.overloadRationale}</p>
                        </CardFooter>
                      </Card>
                    ),
                  )}
                </div>
                <div className="flex gap-4 justify-end mt-6">
                  {!prescribedWorkout && (
                    <Button variant="secondary" onClick={handleDiscard}>
                      Discard
                    </Button>
                  )}
                  <Button onClick={handleStartWorkout}>
                    Accept & Start Workout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* ... (Your exact LIVE WORKOUT UI goes here - kept identical for brevity) ... */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    Live Workout
                  </h2>
                  <Button variant="destructive" onClick={handleCancelWorkout}>
                    Cancel Session
                  </Button>
                </div>

                <div className="space-y-6">
                  {activeWorkout.data?.map(
                    (exercise: Exercise, exerciseIndex: number) => {
                      const logs = workoutLogs[exerciseIndex] || [];
                      const isCompleted =
                        logs.length > 0 &&
                        logs.every(
                          (log) => log.reps !== "" && log.weight !== "",
                        );

                      return (
                        <Card
                          key={exerciseIndex}
                          className={`flex flex-col border ${isCompleted ? "border-green-500/50 bg-green-50/10" : "border-border"}`}
                        >
                          <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Dumbbell className="w-5 h-5 text-primary" />
                                {exercise.exerciseName}
                              </CardTitle>
                              {isCompleted && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Target: {exercise.targetSets} sets ×{" "}
                              {exercise.targetReps} reps @{" "}
                              {exercise.recommendedWeight > 0
                                ? `${exercise.recommendedWeight} lbs`
                                : "Self-Selected"}
                            </p>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              {logs.map((log, setIndex) => (
                                <div
                                  key={setIndex}
                                  className="flex items-center gap-3 md:gap-4"
                                >
                                  <div className="w-12 text-center text-sm font-medium text-muted-foreground">
                                    Set {setIndex + 1}
                                  </div>
                                  <div className="flex-1 flex gap-3 md:gap-4">
                                    <div className="flex-1 relative">
                                      <Input
                                        type="number"
                                        placeholder="Reps"
                                        className="text-lg h-14 text-center md:text-left"
                                        value={log.reps}
                                        onChange={(e) =>
                                          handleLogChange(
                                            exerciseIndex,
                                            setIndex,
                                            "reps",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="flex-1 relative">
                                      <Input
                                        type="number"
                                        placeholder="Lbs"
                                        className="text-lg h-14 text-center md:text-left"
                                        value={log.weight}
                                        onChange={(e) =>
                                          handleLogChange(
                                            exerciseIndex,
                                            setIndex,
                                            "weight",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    },
                  )}
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t flex justify-end z-20">
                  <div className="max-w-6xl mx-auto w-full flex justify-end">
                    <Button
                      onClick={handleFinishWorkout}
                      disabled={isCompleting}
                      size="lg"
                      className="w-full md:w-auto h-14 text-lg"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {isCompleting ? "Saving..." : "Finish Workout"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* 🛠️ TAB 2: TRAINING HISTORY */}
          <TabsContent value="history" className="space-y-6 mt-6">
            {workoutHistory.length === 0 ? (
              <Card className="p-12 text-center text-muted-foreground border-dashed">
                <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
                You haven't completed any workouts yet.
              </Card>
            ) : (
              workoutHistory.map((workout: any) => (
                <Card key={workout.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        {workout.focus || workout.name}{" "}
                        {workout.programDay
                          ? `(Day ${workout.programDay.dayNumber})`
                          : ""}
                      </CardTitle>
                      <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {workout.workoutExercises.map((we: any) => (
                        <div key={we.id} className="p-6">
                          <h4 className="text-md font-semibold text-primary mb-4 flex items-center gap-2">
                            <Dumbbell className="w-4 h-4" /> {we.exercise.name}
                          </h4>
                          <div className="grid grid-cols-4 gap-4 text-xs tracking-wider uppercase font-semibold text-muted-foreground mb-2 px-2">
                            <div>Set</div>
                            <div>Reps</div>
                            <div>Weight</div>
                            <div>Notes</div>
                          </div>
                          <div className="space-y-2">
                            {we.sets.map((set: any) => (
                              <div
                                key={set.id}
                                className="grid grid-cols-4 gap-4 text-sm bg-muted/20 p-3 rounded-md items-center border"
                              >
                                <div className="font-medium text-muted-foreground">
                                  Set {set.setNumber}
                                </div>
                                <div>{set.reps}</div>
                                <div className="font-bold">
                                  {set.weight}{" "}
                                  <span className="text-xs text-muted-foreground font-normal">
                                    lbs
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
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
        </Tabs>
      </div>

      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium text-lg">
            Workout Logged! Data synced to your Coach.
          </span>
        </div>
      )}
    </div>
  );
}

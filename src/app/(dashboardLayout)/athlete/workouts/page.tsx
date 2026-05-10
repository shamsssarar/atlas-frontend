"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dumbbell, Sparkles, Target, Info, CheckCircle } from "lucide-react";
import {
  useGenerateNextWorkoutMutation,
  useStartWorkoutMutation,
  useAddExerciseToWorkoutMutation,
  useLogSetMutation,
} from "@/features/workouts/workoutApi";

interface Exercise {
  exerciseName: string;
  targetSets: number;
  targetReps: number;
  recommendedWeight: number;
  overloadRationale: string;
}

interface WorkoutPlan {
  data?: Exercise[];
}

interface LoggedSet {
  reps: string;
  weight: string;
}

export default function WorkoutsPage() {
  const [generateNextWorkout, { isLoading }] = useGenerateNextWorkoutMutation();
  const [startWorkout] = useStartWorkoutMutation();
  const [addExerciseToWorkout] = useAddExerciseToWorkoutMutation();
  const [logSet] = useLogSetMutation();

  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(
    null,
  );
  const [isLogging, setIsLogging] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [workoutLogs, setWorkoutLogs] = useState<Record<number, LoggedSet[]>>(
    {},
  );
  const [showToast, setShowToast] = useState(false);

  const handleGenerateWorkout = async () => {
    try {
      const result = (await generateNextWorkout().unwrap()) as WorkoutPlan;
      console.log("AI-generated workout JSON:", result);
      setGeneratedWorkout(result);
    } catch (error) {
      console.error("Failed to generate workout:", error);
    }
  };

  const handleDiscard = () => {
    setGeneratedWorkout(null);
  };

  const handleStartWorkout = () => {
    if (!generatedWorkout?.data) return;

    // Initialize logs for each set
    const initialLogs: Record<number, LoggedSet[]> = {};
    generatedWorkout.data.forEach((exercise, index) => {
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
      return {
        ...prev,
        [exerciseIndex]: updatedExerciseLogs,
      };
    });
  };

  const handleFinishWorkout = async () => {
    if (!generatedWorkout?.data) return;

    setIsCompleting(true);
    try {
      // 1. Start the workout session
      const workoutResult = (await startWorkout({
        name: "AI Generated Workout",
        focus: "AI Prescribed",
      }).unwrap()) as any;

      const workoutId =
        workoutResult.id || workoutResult.data?.id || workoutResult._id;

      if (!workoutId) {
        throw new Error("Failed to retrieve workout ID");
      }

      // 2. Iterate through exercises and add them
      for (let i = 0; i < generatedWorkout.data.length; i++) {
        const exercise = generatedWorkout.data[i];
        const logs = workoutLogs[i] || [];

        const exerciseResult = (await addExerciseToWorkout({
          workoutId,
          body: {
            exerciseName: exercise.exerciseName,
            targetSets: exercise.targetSets,
            targetReps: exercise.targetReps,
            recommendedWeight: exercise.recommendedWeight,
          },
        }).unwrap()) as any;

        const workoutExerciseId =
          exerciseResult.id || exerciseResult.data?.id || exerciseResult._id;

        if (workoutExerciseId) {
          // 3. Iterate through completed sets and log them
          for (let j = 0; j < logs.length; j++) {
            const setLog = logs[j];
            if (setLog.reps && setLog.weight) {
              await logSet({
                workoutExerciseId,
                body: {
                  setNumber: j + 1,
                  reps: parseInt(setLog.reps, 10),
                  weight: parseFloat(setLog.weight),
                },
              }).unwrap();
            }
          }
        }
      }

      // On success
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Reset states
      setIsLogging(false);
      setGeneratedWorkout(null);
      setWorkoutLogs({});
    } catch (error) {
      console.error("Failed to complete workout:", error);
      alert(
        "Failed to complete workout. Please check your connection and try again.",
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

  return (
    <div className="min-h-screen bg-background p-6 relative">
      <div className="max-w-6xl mx-auto pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Training Logs</h1>
          <p className="text-muted-foreground">
            Your complete workout history and training analytics
          </p>
        </div>

        {!generatedWorkout ? (
          <div className="flex items-center justify-center min-h-[500px]">
            <Card className="border-dashed border-2 p-8 text-center max-w-md">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-muted rounded-lg">
                  <Dumbbell className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-2">No Recent Workouts</h2>

              <p className="text-muted-foreground mb-6">
                Start your fitness journey by generating your first AI-powered
                workout tailored to your goals and fitness level.
              </p>

              <Button
                onClick={handleGenerateWorkout}
                disabled={isLoading}
                size="lg"
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isLoading
                  ? "Analyzing CNS & Generating..."
                  : "Generate Next Workout (AI)"}
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                Our AI analyzes your profile to create personalized training
                routines
              </p>
            </Card>
          </div>
        ) : !isLogging ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              Today&apos;s Prescribed Workout (AI Generated)
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {generatedWorkout.data?.map(
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
                            {exercise.targetSets} sets × {exercise.targetReps}{" "}
                            reps
                          </span>
                        </div>
                        <div className="text-xl font-bold">
                          @ {exercise.recommendedWeight} lbs
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
              <Button variant="secondary" onClick={handleDiscard}>
                Discard
              </Button>
              <Button onClick={handleStartWorkout}>
                Accept & Start Workout
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
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
              {generatedWorkout.data?.map(
                (exercise: Exercise, exerciseIndex: number) => {
                  const logs = workoutLogs[exerciseIndex] || [];
                  const isCompleted =
                    logs.length > 0 &&
                    logs.every((log) => log.reps !== "" && log.weight !== "");

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
                          {exercise.recommendedWeight} lbs
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
      </div>

      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium text-lg">
            Workout Logged! Data synced to AI Coach.
          </span>
        </div>
      )}
    </div>
  );
}

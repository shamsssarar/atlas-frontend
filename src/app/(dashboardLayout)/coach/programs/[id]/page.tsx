"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Trash,
  Edit,
  Dumbbell,
  CalendarPlus,
  Loader2,
  ArrowLeft,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import Link from "next/link";

import {
  useGetProgramDaysQuery,
  useCreateProgramDayMutation,
  useDeleteProgramDayMutation,
  useAddExerciseTargetMutation,
  useDeleteExerciseTargetMutation,
  ProgramDay,
} from "@/features/programDay/programDayApi";
import { useGetProgramByIdQuery } from "@/features/training-plans/training-plansApi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetExercisesQuery } from "@/features/exercises/exercisesApi";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

function DayCard({
  day,
  onDelete,
  isDeleting,
}: {
  day: ProgramDay;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const [addTarget, { isLoading: isAddingTarget }] =
    useAddExerciseTargetMutation();
  const [deleteTarget, { isLoading: isDeletingTarget }] =
    useDeleteExerciseTargetMutation();

  // 🛠️ 1. Fetch the global exercise dictionary!
  const { data: exercises, isLoading: isLoadingExercises } =
    useGetExercisesQuery();

  const [isAddTargetOpen, setIsAddTargetOpen] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [exerciseId, setExerciseId] = useState("");
  const [targetSets, setTargetSets] = useState("");
  const [targetReps, setTargetReps] = useState("");
  const [order, setOrder] = useState("");

  const handleAddTarget = async () => {
    try {
      if (!exerciseId || !targetSets || !targetReps || !order) {
        throw new Error("Please fill in all fields.");
      }

      await addTarget({
        programDayId: day.id,
        exerciseId,
        targetSets: parseInt(targetSets, 10),
        targetReps,
        order: parseInt(order, 10),
      }).unwrap();

      toast.success("Exercise target added");
      setIsAddTargetOpen(false);
      setExerciseId("");
      setTargetSets("");
      setTargetReps("");
      setOrder("");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add exercise target";
      toast.error(errorMessage);
    }
  };

  const handleDeleteTarget = async (targetId: string) => {
    try {
      await deleteTarget({ targetId, programDayId: day.id }).unwrap();
      toast.success("Exercise target deleted");
    } catch (err) {
      toast.error("Failed to delete exercise target");
    }
  };
  console.log(`Data for Day ${day.dayNumber}:`, day);

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg text-slate-100 flex items-center">
          <Dumbbell className="mr-2 h-5 w-5 text-blue-400" />
          Day {day.dayNumber}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          disabled={isDeleting}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mt-4">
          {(() => {
            const targetsArray =
              day.targets ||
              (day as any).exerciseTargets ||
              day.ExerciseTarget ||
              [];

            if (targetsArray.length > 0) {
              return targetsArray.map((target: any) => {
                const exerciseDetails = exercises?.find(
                  (ex) => ex.id === target.exerciseId,
                );
                console.log(`Data for Day ${day.dayNumber}:`, day);

                return (
                  <div
                    key={target.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 gap-3"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
                      <span className="font-semibold text-blue-200">
                        {exerciseDetails
                          ? exerciseDetails.name
                          : "Loading exercise..."}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded-md">
                        Sets: {target.targetSets}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded-md">
                        Reps: {target.targetReps}
                      </span>
                      <span className="text-slate-500">
                        Order: {target.order}
                      </span>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTarget(target.id)}
                        disabled={isDeletingTarget}
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              });
            } else {
              return (
                <div className="text-sm text-slate-500 italic py-2">
                  No exercises added yet.
                </div>
              );
            }
          })()}

          <div className="pt-3">
            <Dialog open={isAddTargetOpen} onOpenChange={setIsAddTargetOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Exercise
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 text-slate-50 border-slate-800">
                <DialogHeader>
                  <DialogTitle>Add Exercise Target</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Select an exercise and define the parameters.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* 🛠️ 3. The new Dropdown UI! */}
                  <div className="grid gap-2">
                    <Label>Select Exercise</Label>
                    {isLoadingExercises ? (
                      <div className="flex items-center h-10 px-3 rounded-md border border-slate-700 bg-slate-800 text-sm text-slate-400">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Loading library...
                      </div>
                    ) : (
                      <Popover
                        open={openCombobox}
                        onOpenChange={setOpenCombobox}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCombobox}
                            className="w-full justify-between bg-slate-800 border-slate-700 text-slate-50 hover:bg-slate-700 hover:text-white"
                          >
                            {exerciseId
                              ? exercises?.find((ex) => ex.id === exerciseId)
                                  ?.name
                              : "-- Choose an exercise --"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[380px] p-0 bg-slate-900 border-slate-800">
                          <Command className="bg-slate-900 text-slate-50">
                            <CommandInput
                              placeholder="Search exercises..."
                              className="text-slate-50"
                            />
                            <CommandList>
                              <CommandEmpty className="py-6 text-center text-sm text-slate-400">
                                No exercise found.
                              </CommandEmpty>
                              <CommandGroup>
                                {exercises?.map((ex) => (
                                  <CommandItem
                                    key={ex.id}
                                    value={ex.name} // 👈 Critical: This is what the user searches against
                                    onSelect={() => {
                                      setExerciseId(ex.id);
                                      setOpenCombobox(false);
                                    }}
                                    className="text-slate-200 data-[selected=true]:bg-slate-800 data-[selected=true]:text-white cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4 text-blue-400",
                                        exerciseId === ex.id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {ex.name}
                                    <span className="ml-2 text-slate-500 text-xs">
                                      ({ex.targetMuscle})
                                    </span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Sets</Label>
                      <Input
                        type="number"
                        value={targetSets}
                        onChange={(e) => setTargetSets(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-slate-50"
                        placeholder="e.g. 3"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Reps</Label>
                      <Input
                        value={targetReps}
                        onChange={(e) => setTargetReps(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-slate-50"
                        placeholder="e.g. 8-12"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-slate-50"
                      placeholder="e.g. 1"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddTarget}
                  disabled={isAddingTarget || !exerciseId}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-700"
                >
                  {isAddingTarget ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Save Exercise"
                  )}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProgramDaysManagement() {
  const params = useParams();
  const programId = params.id as string;
  const router = useRouter();

  const { data: program, isLoading: isLoadingProgram } =
    useGetProgramByIdQuery(programId);
  const { data: days = [], isLoading: isLoadingDays } =
    useGetProgramDaysQuery(programId);

  const [createDay, { isLoading: isCreatingDay }] =
    useCreateProgramDayMutation();
  const [deleteDay, { isLoading: isDeletingDay }] =
    useDeleteProgramDayMutation();

  const [isAddDayOpen, setIsAddDayOpen] = useState(false);
  const [newDayNumber, setNewDayNumber] = useState("");

  const handleAddDay = async () => {
    try {
      const dayNum = parseInt(newDayNumber, 10);
      if (isNaN(dayNum)) throw new Error("Day number must be a valid number");
      await createDay({ programId, dayNumber: dayNum }).unwrap();
      toast.success("Program day added successfully");
      setIsAddDayOpen(false);
      setNewDayNumber("");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add day";
      toast.error(errorMessage);
    }
  };

  const handleDeleteDay = async (id: string) => {
    try {
      await deleteDay(id).unwrap();
      toast.success("Program day deleted");
    } catch (err: unknown) {
      toast.error("Failed to delete day");
    }
  };

  if (isLoadingProgram || isLoadingDays) {
    return (
      <div className="p-4 sm:p-8 min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400">Loading program data...</p>
      </div>
    );
  }

  if (!program && !isLoadingProgram) {
    return (
      <div className="p-4 sm:p-8 min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          Program not found
        </h2>
        <p className="text-slate-400 mb-6">
          The program you are looking for does not exist or you don&apos;t have
          access.
        </p>
        <Button
          onClick={() => router.push("/coach/programs")}
          variant="outline"
        >
          Back to Programs
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 min-h-[calc(100vh-100px)] bg-slate-950 text-slate-50 w-full rounded-xl">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/coach/programs"
          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programs
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {program?.name}{" "}
              <span className="text-slate-400 text-lg font-normal">
                - Manage Days
              </span>
            </h1>
            <p className="text-slate-400 mt-1">
              Add and manage training days and exercise targets.
            </p>
          </div>
          <Dialog open={isAddDayOpen} onOpenChange={setIsAddDayOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
                <CalendarPlus className="mr-2 h-4 w-4" /> Add Day
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 text-slate-50 border-slate-800">
              <DialogHeader>
                <DialogTitle>Add Program Day</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Enter the day number for the new training day.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="dayNumber">Day Number</Label>
                  <Input
                    id="dayNumber"
                    type="number"
                    value={newDayNumber}
                    onChange={(e) => setNewDayNumber(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-50"
                    placeholder="e.g. 1"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddDay}
                disabled={isCreatingDay}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isCreatingDay ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Save Day"
                )}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="pt-2">
          {days && days.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {days.map((day: ProgramDay) => (
                <DayCard
                  key={day.id}
                  day={day}
                  onDelete={() => handleDeleteDay(day.id)}
                  isDeleting={isDeletingDay}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed text-slate-400">
              <CalendarPlus className="h-12 w-12 mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-1">
                No program days
              </h3>
              <p className="max-w-sm mx-auto">
                Get started by adding your first program day to build the
                training schedule.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

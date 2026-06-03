"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash, Edit, ClipboardList, Loader2 } from "lucide-react";
import Link from "next/link";

import {
  useGetCoachProgramsQuery,
  useCreateProgramMutation,
  useDeleteProgramMutation,
  Program,
} from "@/features/training-plans/training-plansApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

function ProgramCard({
  program,
  onDelete,
  isDeleting,
}: {
  program: Program;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <Card className="bg-slate-800 border-slate-700 shadow-md">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-lg text-slate-100 flex items-center mb-1">
            <ClipboardList className="mr-2 h-5 w-5 text-blue-400" />
            {program.name}
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            {program.durationWeeks} Weeks{" "}
            {program.category ? `• ${program.category}` : ""}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
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
            onClick={onDelete}
            disabled={isDeleting}
            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="mt-2">
        {program.description ? (
          <p className="text-sm text-slate-300 mb-4 line-clamp-2 min-h-[40px]">
            {program.description}
          </p>
        ) : (
          <p className="text-sm text-slate-500 italic mb-4 min-h-[40px]">
            No description provided.
          </p>
        )}
        <Link href={`/coach/programs/${program.id}`}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Manage Days
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function CoachProgramsPage() {
  const { data: rawResponse, isLoading: isLoadingPrograms } =
    useGetCoachProgramsQuery();
  const programs = rawResponse || rawResponse || [];
  const [createProgram, { isLoading: isCreatingProgram }] =
    useCreateProgramMutation();
  const [deleteProgram, { isLoading: isDeletingProgram }] =
    useDeleteProgramMutation();

  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [category, setCategory] = useState("");

  const handleAddProgram = async () => {
    try {
      if (!name || !durationWeeks) {
        throw new Error("Name and Duration (Weeks) are required.");
      }

      const duration = parseInt(durationWeeks, 10);
      if (isNaN(duration) || duration <= 0) {
        throw new Error("Duration must be a valid positive number.");
      }

      await createProgram({
        name,
        description,
        durationWeeks: duration,
        category,
      }).unwrap();

      toast.success("Program created successfully");
      setIsAddProgramOpen(false);
      setName("");
      setDescription("");
      setDurationWeeks("");
      setCategory("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create program");
    }
  };

  const handleDeleteProgram = async (id: string) => {
    try {
      await deleteProgram(id).unwrap();
      toast.success("Program deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete program");
    }
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-slate-950 text-slate-50 w-full rounded-xl">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              My Training Programs
            </h1>
            <p className="text-slate-400 mt-1">
              Create and manage your training programs for athletes.
            </p>
          </div>
          <Dialog open={isAddProgramOpen} onOpenChange={setIsAddProgramOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
                <Plus className="mr-2 h-4 w-4" /> Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 text-slate-50 border-slate-800 max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Program</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Create a new training program by filling out the details
                  below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Program Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-50"
                    placeholder="e.g., 12-Week Powerlifting"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Brief description of the program..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="durationWeeks">Duration (Weeks) *</Label>
                    <Input
                      id="durationWeeks"
                      type="number"
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-slate-50"
                      placeholder="e.g., 12"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-slate-50"
                      placeholder="e.g., Strength"
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={handleAddProgram}
                disabled={isCreatingProgram}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isCreatingProgram ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Save Program"
                )}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="pt-2">
          {isLoadingPrograms ? (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-slate-400">Loading programs...</p>
            </div>
          ) : programs && programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onDelete={() => handleDeleteProgram(program.id)}
                  isDeleting={isDeletingProgram}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed text-slate-400">
              <ClipboardList className="h-12 w-12 mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-1">
                No programs found
              </h3>
              <p className="max-w-sm mx-auto">
                Get started by creating your first training program.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

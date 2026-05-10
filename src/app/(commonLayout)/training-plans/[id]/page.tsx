"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGetProgramByIdQuery } from "@/features/training-plans/training-plansApi";

export default function PlanDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: program, isLoading, error } = useGetProgramByIdQuery(id);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        Loading details...
      </div>
    );

  // NOTE: If the user is NOT logged in, your backend will throw a 401 error here because of 'requireAuth'
  if (error)
    return (
      <div className="text-center mt-20 space-y-4">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p className="text-zinc-400">
          You must be logged in to view program details.
        </p>
        <Link href="/login">
          <Button variant="outline">Go to Login</Button>
        </Link>
      </div>
    );

  if (!program)
    return <div className="text-center mt-20">Program not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/training-plans"
        className="inline-flex items-center text-sm text-primary hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programs
      </Link>

      <div className="space-y-8">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary mb-2 block">
            {program.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {program.name}
          </h1>
          <p className="text-xl text-zinc-400">{program.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
              <Calendar className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-zinc-200">Duration</h3>
              <p className="text-zinc-400">{program.durationWeeks} Weeks</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
              <Activity className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-zinc-200">Category</h3>
              <p className="text-zinc-400">{program.category}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
              <User className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-zinc-200">Coach ID</h3>
              <p className="text-zinc-400 text-xs truncate w-full">
                {program.coachId}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex justify-center">
          <Button size="lg" className="w-full md:w-auto px-12 text-lg">
            Enroll in Program
          </Button>
        </div>
      </div>
    </div>
  );
}

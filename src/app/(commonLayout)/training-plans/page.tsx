"use client";

import { useGetPublicProgramsQuery } from "@/features/training-plans/training-plansApi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, User } from "lucide-react";
import Link from "next/link";

export default function TrainingPlansPage() {
  const { data, isLoading, error } = useGetPublicProgramsQuery();

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        Loading programs...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load training plans.
      </div>
    );

  const programs = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Command Your Training
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore elite training programs crafted by our top coaches.
        </p>
      </div>

      {programs.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No public programs available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card
              key={program.id}
              className="flex flex-col hover:border-primary/50 transition-colors bg-zinc-900/50 border-zinc-800"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                    {program.category || "General"}
                  </span>
                </div>
                <CardTitle className="text-xl">{program.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {program.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-col gap-2 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{program.durationWeeks} Weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>
                      Coach {program.coach?.profile?.firstName || "Unknown"}{" "}
                      {program.coach?.profile?.lastName || ""}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/training-plans/${program.id}`} className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

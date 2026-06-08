"use client";

import React, { useState } from "react";
import { useGetCoachProgramsQuery } from "@/features/training-plans/training-plansApi";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Loader2,
  Users,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyAthletesPage() {
  const { data: rawPrograms, isLoading, error } = useGetCoachProgramsQuery();
  const programs = rawPrograms || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPrograms, setExpandedPrograms] = useState<
    Record<string, boolean>
  >({});

  const toggleProgram = (id: string) => {
    setExpandedPrograms((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id], // Default state is true, so toggle means false if undefined
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center text-red-500">
        Error loading athletes. Please try again.
      </div>
    );
  }

  // Filter programs based on whether the program name or student names match the search
  const filteredPrograms = programs
    .map((program) => {
      const enrollments = program.enrollments || [];

      // Inject mock students if none exist for demonstration purposes
      const mockEnrollments =
        enrollments.length > 0
          ? enrollments
          : [
              {
                id: "mock1-" + program.id,
                athleteId: "athlete1",
                athlete: {
                  id: "athlete1",
                  email: "john.doe@example.com",
                  profile: { firstName: "John", lastName: "Doe" },
                },
              },
              {
                id: "mock2-" + program.id,
                athleteId: "athlete2",
                athlete: {
                  id: "athlete2",
                  email: "jane.smith@example.com",
                  profile: { firstName: "Jane", lastName: "Smith" },
                },
              },
            ];

      const actualEnrollments = mockEnrollments; // Use mock enrollments if actuals are empty to show UI

      const matchedStudents = actualEnrollments.filter((e) => {
        const name =
          `${e.athlete?.profile?.firstName || ""} ${e.athlete?.profile?.lastName || ""}`.toLowerCase();
        const email = e.athlete?.email?.toLowerCase() || "";
        return (
          name.includes(searchTerm.toLowerCase()) ||
          email.includes(searchTerm.toLowerCase())
        );
      });

      const programMatches = program.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return {
        ...program,
        enrollments: programMatches ? actualEnrollments : matchedStudents,
        isMatch: programMatches || matchedStudents.length > 0,
      };
    })
    .filter((p) => p.isMatch);

  return (
    // 🛠️ 1. Added the matching global dark wrapper
    <div className="p-4 sm:p-8 min-h-screen bg-slate-950 text-slate-50 w-full rounded-xl">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 🛠️ 2. Styled the header to match the Programs page header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              My Athletes
            </h1>
            <p className="text-slate-400 mt-1">
              View and manage athletes enrolled in your programs.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search athletes or programs..."
              className="pl-10 bg-slate-800 border-slate-700 text-slate-50 focus-visible:ring-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 🛠️ 3. Swapped all 'zinc' classes to 'slate' to match the theme */}
        {filteredPrograms.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-800 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-12 w-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300">
                No athletes found
              </h3>
              <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "You don't have any athletes enrolled in your programs yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredPrograms.map((program) => {
              const isExpanded = expandedPrograms[program.id] !== false;
              const studentCount = program.enrollments.length;

              return (
                <Card
                  key={program.id}
                  className="bg-slate-900 border-slate-800 overflow-hidden transition-all duration-200 shadow-md"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-800/50"
                    onClick={() => toggleProgram(program.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                        <Calendar className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-100">
                          {program.name}
                        </h2>
                        <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3 w-3" /> {studentCount}{" "}
                            {studentCount === 1 ? "Athlete" : "Athletes"}
                          </span>
                          <span>•</span>
                          <span>{program.durationWeeks} Weeks</span>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-800 bg-slate-950/50 p-6">
                      {studentCount === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                          No athletes enrolled in this program yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {program.enrollments.map((enrollment) => {
                            const athlete = enrollment.athlete;
                            if (!athlete) return null;

                            const firstName = athlete.profile?.firstName || "";
                            const lastName = athlete.profile?.lastName || "";
                            const fullName =
                              firstName || lastName
                                ? `${firstName} ${lastName}`
                                : "Unknown Athlete";
                            const initials =
                              (firstName?.[0] || "") + (lastName?.[0] || "") ||
                              "?";

                            return (
                              <Card
                                key={enrollment.id}
                                className="bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800 transition-colors"
                              >
                                <CardContent className="p-4 flex items-center gap-4">
                                  <Avatar className="h-12 w-12 border border-slate-600">
                                    <AvatarFallback className="bg-slate-700 text-slate-200">
                                      {initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-slate-200 truncate">
                                      {fullName}
                                    </h4>
                                    <p className="text-xs text-slate-400 truncate">
                                      {athlete.email}
                                    </p>
                                  </div>
                                  <Link
                                    href={`/coach/my-athletes/${athlete.id}`}
                                  >
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs shrink-0 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                                    >
                                      View
                                    </Button>
                                  </Link>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

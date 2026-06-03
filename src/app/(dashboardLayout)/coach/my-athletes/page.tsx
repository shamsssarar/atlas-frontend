"use client";

import React, { useState } from "react";
import { useGetCoachProgramsQuery } from "@/features/training-plans/training-plansApi";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Users, Search, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MyAthletesPage() {
  const { data: rawPrograms, isLoading, error } = useGetCoachProgramsQuery();
  const programs = rawPrograms || [];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPrograms, setExpandedPrograms] = useState<Record<string, boolean>>({});

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
  const filteredPrograms = programs.map(program => {
    const enrollments = program.enrollments || [];
    
    // Inject mock students if none exist for demonstration purposes
    const mockEnrollments = enrollments.length > 0 ? enrollments : [
      {
        id: "mock1-" + program.id,
        athleteId: "athlete1",
        athlete: {
          id: "athlete1",
          email: "john.doe@example.com",
          profile: { firstName: "John", lastName: "Doe" }
        }
      },
      {
        id: "mock2-" + program.id,
        athleteId: "athlete2",
        athlete: {
          id: "athlete2",
          email: "jane.smith@example.com",
          profile: { firstName: "Jane", lastName: "Smith" }
        }
      }
    ];

    const actualEnrollments = mockEnrollments; // Use mock enrollments if actuals are empty to show UI 

    const matchedStudents = actualEnrollments.filter(e => {
      const name = `${e.athlete?.profile?.firstName || ""} ${e.athlete?.profile?.lastName || ""}`.toLowerCase();
      const email = e.athlete?.email?.toLowerCase() || "";
      return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    });

    const programMatches = program.name.toLowerCase().includes(searchTerm.toLowerCase());

    return {
      ...program,
      enrollments: programMatches ? actualEnrollments : matchedStudents,
      isMatch: programMatches || matchedStudents.length > 0
    };
  }).filter(p => p.isMatch);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Athletes</h1>
          <p className="text-zinc-400 mt-1">
            View and manage athletes enrolled in your programs.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search athletes or programs..." 
            className="pl-10 bg-zinc-900 border-zinc-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredPrograms.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-zinc-500 mb-4" />
            <h3 className="text-lg font-medium text-zinc-200">No athletes found</h3>
            <p className="text-zinc-400 mt-2">
              {searchTerm ? "Try adjusting your search terms." : "You don't have any athletes enrolled in your programs yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPrograms.map((program) => {
            const isExpanded = expandedPrograms[program.id] !== false; // Default to true
            const studentCount = program.enrollments.length;

            return (
              <Card key={program.id} className="bg-zinc-900 border-zinc-800 overflow-hidden transition-all duration-200">
                <div 
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50"
                  onClick={() => toggleProgram(program.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-100">{program.name}</h2>
                      <p className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" /> {studentCount} {studentCount === 1 ? 'Athlete' : 'Athletes'}
                        </span>
                        <span>•</span>
                        <span>{program.durationWeeks} Weeks</span>
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-zinc-400">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </div>

                {isExpanded && (
                  <div className="border-t border-zinc-800 bg-zinc-950/30 p-6">
                    {studentCount === 0 ? (
                      <div className="text-center py-8 text-zinc-500">
                        No athletes enrolled in this program yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {program.enrollments.map((enrollment) => {
                          const athlete = enrollment.athlete;
                          if (!athlete) return null;
                          
                          const firstName = athlete.profile?.firstName || "";
                          const lastName = athlete.profile?.lastName || "";
                          const fullName = firstName || lastName ? `${firstName} ${lastName}` : "Unknown Athlete";
                          const initials = (firstName?.[0] || "") + (lastName?.[0] || "") || "?";

                          return (
                            <Card key={enrollment.id} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
                              <CardContent className="p-4 flex items-center gap-4">
                                <Avatar className="h-12 w-12 border border-zinc-800">
                                  <AvatarFallback className="bg-zinc-800 text-zinc-300">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-zinc-200 truncate">
                                    {fullName}
                                  </h4>
                                  <p className="text-xs text-zinc-500 truncate">
                                    {athlete.email}
                                  </p>
                                </div>
                                <Button size="sm" variant="outline" className="text-xs shrink-0">
                                  View
                                </Button>
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
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Users, ArrowRight } from "lucide-react";

export default function CoachDashboardOverview() {
  return (
    <div className="p-4 sm:p-8 min-h-[calc(100vh-100px)] bg-slate-950 text-slate-50 w-full rounded-xl">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Coach Dashboard</h1>
          <p className="text-slate-400 mt-1 text-lg">
            Welcome back! What would you like to manage today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <Link href="/coach/programs">
            <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">My Programs</CardTitle>
                <CardDescription className="text-slate-400 text-base">
                  Create, edit, and manage your training programs, days, and exercises.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center text-blue-400 font-medium group-hover:translate-x-1 transition-transform mt-4">
                View Programs <ArrowRight className="ml-2 h-4 w-4" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/coach/my-athletes">
            <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">My Athletes</CardTitle>
                <CardDescription className="text-slate-400 text-base">
                  Monitor the progress of your athletes and see who is enrolled in your programs.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center text-emerald-400 font-medium group-hover:translate-x-1 transition-transform mt-4">
                View Athletes <ArrowRight className="ml-2 h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

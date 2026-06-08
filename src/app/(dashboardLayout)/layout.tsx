"use client";

import Sidebar from "@/components/layout/Sidebar";
import ChatbotWidget from "@/features/aiInsight/ChatbotWidget";
import { Toaster } from "@/components/ui/sonner";
import { usePathname, notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isAuthenticated, isAuthLoading } = useAuth();
  
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🛠️ THE FIX: Handle routing safely inside a useEffect
  useEffect(() => {
    // Only redirect if we are fully loaded and definitely not authenticated
    if (isMounted && !isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthLoading, isMounted, router]);

  // 🛡️ THE SHIELD: If Next.js hasn't mounted, OR Firebase is still thinking, wait!
  if (!isMounted || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="animate-pulse flex flex-col items-center">
          <span className="text-xl font-bold tracking-widest text-primary mb-2">ATLAS</span>
          <span className="text-sm">Verifying credentials...</span>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated Guard
  // If not authenticated, return null so the screen is blank while the useEffect redirects
  if (!isAuthenticated) {
    return null; 
  }

  // 2. The Master RBAC Lock
  if (pathname.startsWith("/athlete") && role !== "ATHLETE") {
    notFound();
  }
  if (pathname.startsWith("/coach") && role !== "COACH") {
    notFound();
  }
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    notFound();
  }

return (
    // 🛠️ FIX 1: Lock the parent to exactly screen height and hide document scrolling
    <div className="flex h-screen overflow-hidden"> 
      
      <Sidebar />
      
      {/* 🛠️ FIX 2: Force only the right-side container to handle vertical scrolling */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
      <ChatbotWidget />
      <Toaster />
    </div>
  );
}
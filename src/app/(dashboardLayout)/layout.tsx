"use client";

import Sidebar from "@/components/layout/Sidebar";
import ChatbotWidget from "@/features/aiInsight/ChatbotWidget";
import { Toaster } from "@/components/ui/sonner";
import { usePathname, notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth"; // ✅ Import our custom hook

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Extract role, auth status, AND loading status from the hook
  const { role, isAuthenticated, isAuthLoading } = useAuth();
  
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  if (!isAuthenticated) {
    router.push("/login");
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 bg-slate-50 overflow-auto">{children}</main>
      </div>
      <ChatbotWidget />
      <Toaster />
    </div>
  );
}
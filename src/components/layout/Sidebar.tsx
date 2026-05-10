"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { logOut } from "@/features/auth/authSlice";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Dumbbell, Activity, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logOut());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/athlete", icon: LayoutDashboard },
    { name: "Workouts", href: "/athlete/workouts", icon: Dumbbell },
    { name: "Biometrics", href: "/athlete/biometrics", icon: Activity },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Atlas
        </h1>
        <p className="text-xs text-slate-400 mt-1">Fitness Companion</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-200 hover:text-white group"
            >
              <Icon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-700 space-y-4">
        <div className="px-4 py-2 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">Logged in as</p>
          <p className="text-sm font-medium text-white truncate">
            {authState.email || "User"}
          </p>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Button>
      </div>
    </aside>
  );
}

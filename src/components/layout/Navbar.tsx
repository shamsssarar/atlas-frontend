"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User, Settings, HelpCircle, LogOut, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const authState = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isPublic =
    pathname === "/" ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/training-plans");

  const isAuthRoute =
    pathname?.startsWith("/login") || pathname?.startsWith("/register");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getInitials = (email?: string | null) => {
    if (!email) return "U";
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Training Plans", href: "/training-plans" },
    { label: "Pricing", href: "/#pricing" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/95 backdrop-blur-md border-b border-slate-800/50 shadow-xl"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className={`p-2 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? "bg-gradient-to-br from-blue-500/20 to-indigo-500/20"
                  : "bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
              }`}
            >
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-bold text-lg text-white hidden sm:inline">
              ATLAS
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isPublic && (
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Auth Buttons for Public */}
            {isPublic && !authState.email && (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* User Dropdown for Authenticated */}
            {authState.email && !isAuthRoute && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full hover:ring-2 hover:ring-blue-400/50 p-1 transition-all duration-300">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authState.email}`}
                      />
                      <AvatarFallback>
                        {getInitials(authState.email)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-slate-900 border-slate-800"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-white">
                      {authState.email || "User"}
                    </p>
                    <p className="text-xs text-slate-400">{authState.role}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <Link
                      href={
                        authState.role === "COACH"
                          ? "/coach"
                          : authState.role === "ADMIN"
                            ? "/admin"
                            : "/athlete"
                      }
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-slate-800"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && isPublic && (
          <div className="lg:hidden pb-4 space-y-3 border-t border-slate-800 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-slate-300 hover:text-white transition-colors py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!authState.email && (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

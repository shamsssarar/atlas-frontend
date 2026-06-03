"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useRouter } from "next/navigation";
import { useLazyGetUserProfileQuery, useSyncUserMutation } from "./authApi";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const [getProfile] = useLazyGetUserProfileQuery();
  const [syncUser] = useSyncUserMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 2. Call RTK Query backend mutation to create PostgreSQL record)

      await user.getIdToken(true);

      const dbResponse = (await syncUser({
        name: user.displayName || "User",
        email: user.email || email,
      }).unwrap()) as any;

      const role = dbResponse?.data?.role || dbResponse?.role || "ATHLETE";
      console.log("Extracted Role:", role);

      // 3. Save user to Redux Global State
      dispatch(
        setCredentials({
          uid: user.uid,
          email: user.email || "",
          role,
        }),
      );

      // 4. Redirect based on role
      if (role === "COACH") {
        router.push("/coach");
      } else if (role === "ADMIN") {
        router.push("/admin"); // Assuming you have an admin route, or fallback
      } else {
        router.push("/athlete");
      }
    } catch (err: any) {
      // 🐛 UNHIDE THE ERROR: Extract the actual message from RTK Query or Firebase
      const realError =
        err?.data?.message || err?.error || err?.message || JSON.stringify(err);
      console.error("Login failed:", realError);
      setError(`Login Error: ${realError}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-primary/10">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Welcome Back
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your training dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="athlete@atlas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useSyncUserMutation } from "@/features/auth/authApi";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const [syncUser] = useSyncUserMutation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Authenticate and create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve the token (not explicitly needed if baseApi is handling it via auth.currentUser, 
      // but retrieving it ensures the Firebase state is fully flushed)
      await user.getIdToken();

      // 2. Call RTK Query backend mutation to create PostgreSQL record
      await syncUser({ name, email }).unwrap();

      // 3. Save user to Redux Global State
      dispatch(
        setCredentials({
          uid: user.uid,
          email: user.email || "",
        })
      );

      // 4. Redirect to the Dashboard
      router.push("/athlete"); 

    } catch (err: unknown) {
      console.error("Registration failed:", err);
      const errorObj = err as any;
      if (errorObj.code === "auth/email-already-in-use") {
        setError("Email already in use. Please use a different email or log in.");
      } else if (errorObj.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else if (errorObj.code === "auth/invalid-email") {
        setError("Invalid email format. Please check your email.");
      } else {
        setError(errorObj?.data?.message || errorObj.message || "Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="w-full max-w-md flex flex-col items-center justify-center space-y-6">
        {/* Optional Logo Space */}
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-2xl shadow-md">
          A
        </div>
        
        <Card className="w-full shadow-lg border-primary/10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
            <CardDescription>Enter your details to start your training journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                  minLength={6}
                />
              </div>
              
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

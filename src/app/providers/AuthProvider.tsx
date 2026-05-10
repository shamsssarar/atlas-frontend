"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setCredentials, logOut } from "@/features/auth/authSlice";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  // We start in a loading state to prevent the "flash" of the login screen
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is Firebase's magic listener. It automatically checks local storage on mount.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, restore them to Redux
        dispatch(
          setCredentials({
            uid: user.uid,
            email: user.email || "",
          })
        );
      } else {
        // User is genuinely logged out
        dispatch(logOut());
      }
      // Finished checking, safe to render the app
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  // Show a blank screen or a spinner while Firebase is thinking (usually takes < 100ms)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Authenticating...
      </div>
    );
  }

  return <>{children}</>;
}
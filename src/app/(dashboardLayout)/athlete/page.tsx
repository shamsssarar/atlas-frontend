"use client";

import { useState } from "react";
import {
  useGetBiometricsHistoryQuery,
  useLogBiometricsMutation,
} from "@/features/biometrics/biometricsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AthleteDashboard() {
  const user = useSelector((state: RootState) => state.auth);
  const { data: response, isLoading, error } = useGetBiometricsHistoryQuery(7);

  // Bring in our new mutation
  const [logBiometrics, { isLoading: isSubmitting }] =
    useLogBiometricsMutation();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [weight, setWeight] = useState("");
  const [sleep, setSleep] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logBiometrics({
        weight: parseFloat(weight),
        sleepHours: parseFloat(sleep),
        sleepQuality: 8, // hardcoded for now to save time
        restingHeartRate: 60,
        subjectiveStress: 5,
      }).unwrap(); // unwrap() lets us catch actual API errors

      setIsOpen(false); // Close the modal on success
      setWeight("");
      setSleep("");
    } catch (err) {
      console.error("Failed to log biometrics", err);
    }
  };

  if (!user.isAuthenticated) return <div className="p-8">Please log in...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Athlete Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back. Here is your recent data.
          </p>
        </div>

        {/* THE MODAL TRIGGER */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Log Today's Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Daily Biometrics</DialogTitle>
              <DialogDescription>
                Keep track of your physical metrics to optimize your training.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Bodyweight (lbs)</Label>
                <Input
                  type="number"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Hours of Sleep</Label>
                <Input
                  type="number"
                  step="0.5"
                  required
                  value={sleep}
                  onChange={(e) => setSleep(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Biometrics"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="h-32 w-full bg-muted rounded-xl animate-pulse"></div>
      ) : error ? (
        <div className="text-destructive font-medium border border-destructive/20 p-4 rounded-xl bg-destructive/10">
          Failed to load backend data.
        </div>
      ) : response?.data?.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
          No data recorded yet. Click the button above to log your first entry!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {response?.data?.map((log: any) => (
            <Card key={log.id} className="border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {new Date(log.date).toLocaleDateString()}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{log.weight} lbs</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sleep: {log.sleepHours} hrs
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

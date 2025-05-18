
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HydrationProgressBar } from "./hydration-progress-bar";
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

interface HydrationTrackerProps {
  currentIntake: number;
  dailyGoal: number;
  onOpenGoalModal: () => void;
  isInitialized: boolean;
}

const formatVolume = (ml: number): string => {
  if (ml >= 1000) {
    const liters = (ml / 1000).toFixed(1);
    const formattedLiters = liters.endsWith('.0') ? liters.substring(0, liters.length - 2) : liters;
    return `${ml}ml (${formattedLiters}L)`;
  }
  return `${ml}ml`;
};

export function HydrationTracker({ currentIntake, dailyGoal, onOpenGoalModal, isInitialized }: HydrationTrackerProps) {
  if (!isInitialized) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Today's Hydration</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-80">
          <div className="animate-pulse text-muted-foreground">Loading hydration data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Today's Hydration</CardTitle>
          <Button variant="outline" size="sm" onClick={onOpenGoalModal} aria-label="Set hydration goal">
            <Target className="mr-2 h-4 w-4" /> Goal: {formatVolume(dailyGoal)}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <HydrationProgressBar currentIntake={currentIntake} dailyGoal={dailyGoal} />
      </CardContent>
    </Card>
  );
}

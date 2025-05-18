
"use client";

import React from 'react';

interface HydrationProgressBarProps {
  currentIntake: number;
  dailyGoal: number;
}

const formatVolume = (ml: number): string => {
  if (ml >= 1000) {
    const liters = (ml / 1000).toFixed(1);
    const formattedLiters = liters.endsWith('.0') ? liters.substring(0, liters.length - 2) : liters;
    return `${ml}ml (${formattedLiters}L)`;
  }
  return `${ml}ml`;
};

export function HydrationProgressBar({ currentIntake, dailyGoal }: HydrationProgressBarProps) {
  const percentage = dailyGoal > 0 ? Math.min((currentIntake / dailyGoal) * 100, 100) : 0;

  return (
    <div className="w-full max-w-xs mx-auto my-4">
      <div className="relative h-64 w-32 mx-auto bg-muted rounded-t-xl rounded-b-md border-2 border-primary shadow-inner overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 bg-primary transition-all duration-500 ease-out"
          style={{ height: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
          aria-label="Hydration progress"
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary-foreground mix-blend-difference">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-2">
        {formatVolume(currentIntake)} / {formatVolume(dailyGoal)}
      </p>
    </div>
  );
}


"use client";

import React, { useState } from 'react';
// import Link from 'next/link'; // Link is not used directly if Achievements card is removed
import { AppHeader } from '@/components/layout/app-header';
import { HydrationTracker } from '@/components/hydration/hydration-tracker';
import { LogWaterForm } from '@/components/hydration/log-water-form';
import { GoalSetterModal } from '@/components/hydration/goal-setter-modal';
import { AiInsightsTool } from '@/components/hydration/ai-insights-tool';
// SmartReminderInfo is removed from dashboard view
import { useHydrationData } from '@/hooks/use-hydration-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
// Removed Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle as they were for the removed Achievements link card
// Removed Trophy, ArrowRight imports

export default function HydrateWisePage() {
  const { 
    dailyGoal, 
    currentIntake, 
    logWater, 
    setDailyGoal, 
    isInitialized,
    incrementAiInsightsUsedCount,
  } = useHydrationData(2500);
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto py-6 px-4 space-y-6 max-w-3xl">
          <HydrationTracker
            currentIntake={currentIntake}
            dailyGoal={dailyGoal}
            onOpenGoalModal={() => setIsGoalModalOpen(true)}
            isInitialized={isInitialized}
          />

          {isInitialized ? (
            <>
              <LogWaterForm onLogWater={logWater} />
              <AiInsightsTool onInsightGenerated={incrementAiInsightsUsedCount} />
              {/* SmartReminderInfo component instance removed from here */}
            </>
          ) : (
            <div className="space-y-6">
              <Skeleton className="h-60 w-full rounded-lg" /> {/* HydrationTracker */}
              <Skeleton className="h-48 w-full rounded-lg" /> {/* LogWaterForm */}
              <Skeleton className="h-72 w-full rounded-lg" /> {/* AiInsightsTool */}
              {/* Skeleton for SmartReminderInfo has been removed */}
              <div className="text-center py-10 text-muted-foreground">
                Initializing HydrateWise...
              </div>
            </div>
          )}
        </main>
      </ScrollArea>
      
      <GoalSetterModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={dailyGoal}
        onSetGoal={(newGoal) => {
          setDailyGoal(newGoal);
          setIsGoalModalOpen(false);
        }}
      />
      <footer className="py-4 text-center text-xs text-muted-foreground border-t">
        HydrateWise &copy; {new Date().getFullYear()} - Stay Refreshed!
      </footer>
    </div>
  );
}

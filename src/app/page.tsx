
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';
import { HydrationTracker } from '@/components/hydration/hydration-tracker';
import { LogWaterForm } from '@/components/hydration/log-water-form';
import { GoalSetterModal } from '@/components/hydration/goal-setter-modal';
import { AiInsightsTool } from '@/components/hydration/ai-insights-tool';
import { SmartReminderInfo } from '@/components/hydration/smart-reminder-info';
import { useHydrationData } from '@/hooks/use-hydration-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowRight } from 'lucide-react';

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
              <Card className="shadow-lg w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    Achievements
                  </CardTitle>
                  <CardDescription>
                    Track your hydration milestones and unlock new badges.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    See how far you've come and what challenges await!
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/achievements">
                      View Your Achievements
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <SmartReminderInfo />
            </>
          ) : (
            <div className="space-y-6">
              <Skeleton className="h-60 w-full rounded-lg" /> {/* HydrationTracker */}
              <Skeleton className="h-48 w-full rounded-lg" /> {/* LogWaterForm */}
              <Skeleton className="h-72 w-full rounded-lg" /> {/* AiInsightsTool */}
              <Skeleton className="h-40 w-full rounded-lg" /> {/* Achievements Link Card */}
              <Skeleton className="h-32 w-full rounded-lg" /> {/* SmartReminderInfo */}
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


"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';
import { HydrationTracker } from '@/components/hydration/hydration-tracker';
import { LogWaterForm } from '@/components/hydration/log-water-form';
import { GoalSetterModal } from '@/components/hydration/goal-setter-modal';
// AiInsightsTool is removed from direct dashboard view
import { useHydrationData } from '@/hooks/use-hydration-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, ArrowRight } from 'lucide-react';


export default function HydrateWisePage() {
  const { 
    dailyGoal, 
    currentIntake, 
    logWater, 
    setDailyGoal, 
    isInitialized,
    // incrementAiInsightsUsedCount, // No longer directly used on this page
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
              <Card className="shadow-lg w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6 text-primary" /> AI Hydration Insights</CardTitle>
                  <CardDescription>Get personalized hydration advice tailored to your needs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Unlock insights based on your activity, weather, sleep, and weight to optimize your hydration strategy.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/insights">
                      Get AI Insights <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <div className="space-y-6">
              <Skeleton className="h-60 w-full rounded-lg" /> {/* HydrationTracker */}
              <Skeleton className="h-48 w-full rounded-lg" /> {/* LogWaterForm */}
              <Skeleton className="h-40 w-full rounded-lg" /> {/* AI Insights Link Card */}
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

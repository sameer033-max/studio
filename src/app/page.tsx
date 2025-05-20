
"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer'; 
import { HydrationTracker } from '@/components/hydration/hydration-tracker';
import { LogWaterForm } from '@/components/hydration/log-water-form';
import { GoalSetterModal } from '@/components/hydration/goal-setter-modal';
import { useHydrationData } from '@/hooks/use-hydration-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RotateCcw } from 'lucide-react';
import AdMobBanner from '@/components/ads/admob-banner';
import AdMobNativeAdvanced from '@/components/ads/admob-native-advanced';


export default function HydrateWisePage() {
  const { 
    dailyGoal, 
    currentIntake, 
    logWater, 
    setDailyGoal, 
    resetIntake,
    isInitialized,
  } = useHydrationData(2500);
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // AdMob IDs
  const adMobPublisherId = "ca-app-pub-5300461336032028"; 
  const adMobBannerAdUnitId = "ca-app-pub-5300461336032028/8334237238";
  const adMobNativeAdvancedAdUnitId = "ca-app-pub-5300461336032028/1108443787";


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
              <div className="pt-4">
                <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset Today's Intake
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset your current water intake for today to 0ml. 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          resetIntake();
                          setIsResetDialogOpen(false);
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Confirm Reset
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* AdMob Banner */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Advertisement</h3>
                <AdMobBanner 
                  publisherId={adMobPublisherId}
                  adUnitId={adMobBannerAdUnitId} 
                />
              </div>

              {/* AdMob Native Advanced */}
              <div className="mt-8">
                 <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Sponsored Content</h3>
                <AdMobNativeAdvanced
                  publisherId={adMobPublisherId}
                  adUnitId={adMobNativeAdvancedAdUnitId}
                />
              </div>
              
            </>
          ) : (
            <div className="space-y-6">
              <Skeleton className="h-60 w-full rounded-lg" /> {/* HydrationTracker */}
              <Skeleton className="h-48 w-full rounded-lg" /> {/* LogWaterForm */}
              <Skeleton className="h-9 w-full sm:w-48 rounded-md" /> {/* Reset Button Skeleton */}
              <Skeleton className="h-16 w-full rounded-md mt-8" /> {/* Ad Banner Skeleton */}
              <Skeleton className="h-32 w-full rounded-md mt-8" /> {/* Native Ad Skeleton */}
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
      <AppFooter /> 
    </div>
  );
}


"use client";

import React from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';
import { AchievementsCard } from '@/components/hydration/achievements-card';
import { useHydrationData } from '@/hooks/use-hydration-data';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AchievementsPage() {
  const { 
    dailyGoal, 
    achievementStats,
    unlockedAchievements,
    allAchievements,
    isInitialized
  } = useHydrationData(2500); // Consistent default goal

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto py-6 px-4 space-y-6 max-w-3xl">
          <div className="flex justify-start mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          
          {isInitialized ? (
            <AchievementsCard 
              allAchievements={allAchievements} 
              unlockedAchievementIds={unlockedAchievements}
              achievementStats={achievementStats}
              dailyGoal={dailyGoal}
            />
          ) : (
            <div className="space-y-6">
              {/* Skeleton for the back button */}
              <Skeleton className="h-9 w-44 rounded-md" /> 
              {/* Skeleton for the achievements card */}
              <Skeleton className="h-[600px] w-full rounded-lg" /> 
               <div className="text-center py-10 text-muted-foreground">
                Loading achievements...
              </div>
            </div>
          )}
        </main>
      </ScrollArea>
      <footer className="py-4 text-center text-xs text-muted-foreground border-t">
        HydrateWise &copy; {new Date().getFullYear()} - Stay Refreshed!
      </footer>
    </div>
  );
}

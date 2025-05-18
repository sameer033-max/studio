
"use client";

import React from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';
import { AiInsightsTool } from '@/components/hydration/ai-insights-tool';
import { useHydrationData } from '@/hooks/use-hydration-data';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function InsightsPage() {
  const { 
    isInitialized,
    incrementAiInsightsUsedCount,
  } = useHydrationData(2500); // Default goal, not directly used here but hook needs it

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
            <AiInsightsTool onInsightGenerated={incrementAiInsightsUsedCount} />
          ) : (
            <div className="space-y-6">
              <Skeleton className="h-9 w-44 rounded-md" /> {/* Skeleton for back button */}
              <Skeleton className="h-72 w-full rounded-lg" /> {/* Skeleton for AiInsightsTool */}
               <div className="text-center py-10 text-muted-foreground">
                Loading AI Insights tool...
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

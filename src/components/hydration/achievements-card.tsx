// src/components/hydration/achievements-card.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // For showing progress
import type { Achievement, AchievementId, AchievementStats } from '@/lib/achievements';
import { getAchievementProgress } from '@/lib/achievements'; // Import the helper
import { CheckCircle2, Lock } from 'lucide-react'; // Icons for unlocked/locked

interface AchievementsCardProps {
  allAchievements: Achievement[];
  unlockedAchievementIds: Set<AchievementId>;
  achievementStats: AchievementStats; // Pass current stats for progress calculation
  dailyGoal: number; // Pass daily goal for achievements that depend on it
}

export function AchievementsCard({ allAchievements, unlockedAchievementIds, achievementStats, dailyGoal }: AchievementsCardProps) {
  if (!allAchievements || allAchievements.length === 0) {
    return (
      <Card className="shadow-lg w-full">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>No achievements defined yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" /> Achievements
        </CardTitle>
        <CardDescription>Track your hydration milestones and unlock rewards!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allAchievements.map((achievement) => {
          const isUnlocked = unlockedAchievementIds.has(achievement.id);
          const progress = getAchievementProgress(achievement, achievementStats, dailyGoal);
          const IconComponent = achievement.icon;

          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border flex items-start gap-4 transition-all duration-300 ${
                isUnlocked ? 'bg-accent/20 border-accent shadow-md' : 'bg-muted/30 border-border'
              }`}
            >
              <IconComponent className={`h-10 w-10 mt-1 shrink-0 ${isUnlocked ? 'text-accent-foreground' : 'text-muted-foreground'}`} />
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-semibold ${isUnlocked ? 'text-accent-foreground' : 'text-foreground'}`}>
                    {achievement.name}
                  </h3>
                  {isUnlocked ? (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
                      <CheckCircle2 className="mr-1 h-4 w-4" /> Unlocked
                    </Badge>
                  ) : (
                     <Badge variant="outline" className="border-dashed">
                      <Lock className="mr-1 h-3 w-3" /> Locked
                    </Badge>
                  )}
                </div>
                <p className={`text-sm ${isUnlocked ? 'text-accent-foreground/80' : 'text-muted-foreground'}`}>
                  {achievement.description(achievementStats, dailyGoal)} 
                </p>
                {!isUnlocked && achievement.threshold && progress.threshold > 0 && (achievement.id !== 'GOAL_SETTER_HIGH' || dailyGoal < achievement.threshold) && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress:</span>
                      <span>{progress.current} / {progress.threshold} {achievement.category === 'Volume' ? 'ml' : achievement.category === 'AI Usage' || achievement.category === 'Milestone' ? (achievement.id.startsWith("STAY_HYDRATED") ? 'goals' : 'uses') : achievement.category === 'Streak' ? 'days' : ''}</span>
                    </div>
                    <Progress value={progress.percent} className="h-2 [&>div]:bg-primary" />
                  </div>
                )}
                 {achievement.id === 'GOAL_SETTER_HIGH' && !isUnlocked && dailyGoal < achievement.threshold && (
                   <p className="text-xs text-muted-foreground mt-1">Current goal: {dailyGoal}ml. Set to {achievement.threshold}ml or more.</p>
                 )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Placeholder Trophy icon if not available in specific achievement icon set
const Trophy = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M12.75 0a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0V.75A.75.75 0 0012.75 0zM3.31 3.62a.75.75 0 000 1.06l3.69 3.69a.75.75 0 101.06-1.06L4.37 3.62a.75.75 0 00-1.06 0zm14.38 0a.75.75 0 00-1.06 0l-3.69 3.69a.75.75 0 001.06 1.06l3.69-3.69a.75.75 0 000-1.06zM12 5.25a1.5 1.5 0 00-1.5 1.5v2.625c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V6.75a1.5 1.5 0 00-1.5-1.5z" clipRule="evenodd" />
    <path d="M12 8.25a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9zM3 9a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9A.75.75 0 013 9z" />
    <path fillRule="evenodd" d="M12 12.75a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5v-.261c.43-.227.836-.524 1.196-.884a.75.75 0 10-1.056-1.056 9.003 9.003 0 01-1.14 1.14v.061c0 .414-.336.75-.75.75h-6a.75.75 0 01-.75-.75v-6a.75.75 0 01.75-.75h.261c.227-.43.524-.836.884-1.196a.75.75 0 10-1.056-1.056A9.003 9.003 0 0112.26 12h-.01z" clipRule="evenodd" />
  </svg>
);

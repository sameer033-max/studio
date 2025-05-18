// src/lib/achievements.ts
import type { ComponentType } from 'react';
import { Award, Brain, CalendarDays, Droplets, Sparkles, Star, Target, Trophy, Zap } from 'lucide-react';

export type AchievementId =
  | 'FIRST_SIP'
  | 'STAY_HYDRATED_1'
  | 'STAY_HYDRATED_5'
  | 'STAY_HYDRATED_10'
  | 'STREAK_3_DAYS'
  | 'STREAK_7_DAYS'
  | 'STREAK_PERFECT_MONTH_APPROX' // Approx 30 days
  | 'AI_CURIOUS'
  | 'AI_EXPERT_5'
  | 'AI_GURU_15'
  | 'GOAL_SETTER_HIGH' // e.g. > 3000ml
  | 'TOTAL_VOLUME_10L'
  | 'TOTAL_VOLUME_50L'
  | 'ALL_STAR_COLLECTOR'; // For unlocking a certain number of other achievements

export interface Achievement {
  id: AchievementId;
  name: string;
  description: (stats?: AchievementStats, dailyGoal?: number) => string; // Making stats and dailyGoal optional for general descriptions
  icon: ComponentType<{ className?: string }>;
  threshold?: number; // General purpose threshold for display or logic
  category: 'Milestone' | 'Streak' | 'AI Usage' | 'Volume' | 'Meta';
}

// Mirroring AchievementStats from useHydrationData for type safety if needed here,
// but primarily it's used within the hook for logic.
export interface AchievementStats {
  currentStreak: number;
  lastLogDateISO: string; // YYYY-MM-DD
  goalsMetCount: number;
  lastGoalMetDateISO: string; // YYYY-MM-DD
  totalWaterLoggedMl: number;
  aiInsightsUsedCount: number;
  unlockedAchievementsCount: number; // For meta-achievements
}


export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_SIP',
    name: 'First Sip!',
    description: () => 'Log your first water intake.',
    icon: Sparkles,
    category: 'Milestone',
  },
  {
    id: 'STAY_HYDRATED_1',
    name: 'Goal Getter',
    description: () => 'Reach your daily hydration goal for the first time.',
    icon: Star,
    threshold: 1,
    category: 'Milestone',
  },
  {
    id: 'STAY_HYDRATED_5',
    name: 'Consistent Hydrator',
    description: () => 'Reach your daily goal 5 times.',
    icon: Award,
    threshold: 5,
    category: 'Milestone',
  },
  {
    id: 'STAY_HYDRATED_10',
    name: 'Hydration Hero',
    description: () => 'Reach your daily goal 10 times.',
    icon: Trophy,
    threshold: 10,
    category: 'Milestone',
  },
  {
    id: 'STREAK_3_DAYS',
    name: '3-Day Streak',
    description: () => 'Log water for 3 consecutive days.',
    icon: Zap,
    threshold: 3,
    category: 'Streak',
  },
  {
    id: 'STREAK_7_DAYS',
    name: '7-Day Streak',
    description: () => 'Log water for 7 consecutive days.',
    icon: CalendarDays,
    threshold: 7,
    category: 'Streak',
  },
   {
    id: 'STREAK_PERFECT_MONTH_APPROX',
    name: 'Month-Long Habit',
    description: () => 'Log water for 30 consecutive days.',
    icon: CalendarDays, // Consider a different icon if available
    threshold: 30,
    category: 'Streak',
  },
  {
    id: 'AI_CURIOUS',
    name: 'AI Curious',
    description: () => 'Use the AI Insights tool for the first time.',
    icon: Brain,
    threshold: 1,
    category: 'AI Usage',
  },
  {
    id: 'AI_EXPERT_5',
    name: 'AI Enthusiast',
    description: () => 'Use the AI Insights tool 5 times.',
    icon: Brain,
    threshold: 5,
    category: 'AI Usage',
  },
  {
    id: 'AI_GURU_15',
    name: 'AI Guru',
    description: () => 'Use the AI Insights tool 15 times.',
    icon: Brain, // Consider a "smarter" brain or different color
    threshold: 15,
    category: 'AI Usage',
  },
  {
    id: 'GOAL_SETTER_HIGH',
    name: 'Ambitious Goal',
    description: () => 'Set a daily hydration goal of 3000ml or more.',
    icon: Target,
    threshold: 3000, // ml
    category: 'Milestone',
  },
  {
    id: 'TOTAL_VOLUME_10L',
    name: '10 Liter Club',
    description: () => 'Log a total of 10,000ml (10L) of water.',
    icon: Droplets,
    threshold: 10000, // ml
    category: 'Volume',
  },
  {
    id: 'TOTAL_VOLUME_50L',
    name: 'Hydration Veteran',
    description: () => 'Log a total of 50,000ml (50L) of water.',
    icon: Droplets, // Consider a bigger droplet icon
    threshold: 50000, // ml
    category: 'Volume',
  },
  // Example of a meta-achievement
  // {
  //   id: 'ALL_STAR_COLLECTOR',
  //   name: 'Achievement Hunter',
  //   description: (stats) => `Unlock 5 other achievements. You have ${stats?.unlockedAchievementsCount || 0}/5.`,
  //   icon: Sparkles, // Or a generic "collection" icon
  //   threshold: 5, // Number of other achievements to unlock
  //   category: 'Meta',
  // },
];

export const getAchievementProgress = (achievement: Achievement, stats: AchievementStats, dailyGoal: number): {current: number, threshold: number, percent: number } => {
  const current = 0;
  const threshold = achievement.threshold || 0;
  switch (achievement.id) {
    case 'STAY_HYDRATED_1':
    case 'STAY_HYDRATED_5':
    case 'STAY_HYDRATED_10':
      return { current: stats.goalsMetCount, threshold, percent: threshold > 0 ? Math.min(100, (stats.goalsMetCount / threshold) * 100) : 0 };
    case 'STREAK_3_DAYS':
    case 'STREAK_7_DAYS':
    case 'STREAK_PERFECT_MONTH_APPROX':
      return { current: stats.currentStreak, threshold, percent: threshold > 0 ? Math.min(100, (stats.currentStreak / threshold) * 100) : 0 };
    case 'AI_CURIOUS':
    case 'AI_EXPERT_5':
    case 'AI_GURU_15':
      return { current: stats.aiInsightsUsedCount, threshold, percent: threshold > 0 ? Math.min(100, (stats.aiInsightsUsedCount / threshold) * 100) : 0 };
    case 'GOAL_SETTER_HIGH':
       // This is a one-time check, progress isn't really applicable in the same way.
       // We can show 0% or 100% based on current dailyGoal.
      return { current: dailyGoal >= threshold ? threshold : 0, threshold, percent: dailyGoal >= threshold ? 100: 0};
    case 'TOTAL_VOLUME_10L':
    case 'TOTAL_VOLUME_50L':
      return { current: stats.totalWaterLoggedMl, threshold, percent: threshold > 0 ? Math.min(100, (stats.totalWaterLoggedMl / threshold) * 100) : 0 };
    // case 'ALL_STAR_COLLECTOR':
    //   return { current: stats.unlockedAchievementsCount, threshold, percent: threshold > 0 ? Math.min(100, (stats.unlockedAchievementsCount / threshold) * 100) : 0 };
    default:
      return { current: 0, threshold: 0, percent: 0 }; // Or 100 if it's a simple unlock like FIRST_SIP
  }
};


// src/hooks/use-hydration-data.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { AchievementId, AchievementStats as AchievementStatsDefinition } from '@/lib/achievements'; // Renamed to avoid conflict
import { ALL_ACHIEVEMENTS } from '@/lib/achievements';

// localStorage keys
const GOAL_KEY = 'hydratewise_hydrationGoal';
const INTAKE_KEY = 'hydratewise_hydrationIntake';
const LAST_LOG_DATE_KEY = 'hydratewise_hydrationLastLogDate'; // Tracks reset for daily intake

// Achievement related localStorage keys
const UNLOCKED_ACHIEVEMENTS_KEY = 'hydratewise_unlockedAchievements';
const ACHIEVEMENT_STATS_KEY = 'hydratewise_achievementStats';

// Helper to get today's date in YYYY-MM-DD format
const getTodayISO = () => new Date().toISOString().split('T')[0];

// Helper to get yesterday's date in YYYY-MM-DD format
const getYesterdayISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const getStoredNumber = (key: string, defaultValue: number): number => {
  if (typeof window === 'undefined') return defaultValue;
  const storedValue = localStorage.getItem(key);
  const parsedValue = storedValue ? parseInt(storedValue, 10) : NaN;
  return isNaN(parsedValue) ? defaultValue : parsedValue;
};

const getStoredString = (key: string, defaultValue: string): string => {
  if (typeof window === 'undefined') return defaultValue;
  const storedValue = localStorage.getItem(key);
  return storedValue !== null ? storedValue : defaultValue;
};

const getStoredJson = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const storedValue = localStorage.getItem(key);
  try {
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (e) {
    console.error("Error parsing JSON from localStorage", e);
    return defaultValue;
  }
};

export interface AchievementStats extends AchievementStatsDefinition {}


const initialAchievementStats: AchievementStats = {
  currentStreak: 0,
  lastLogDateISO: '',
  goalsMetCount: 0,
  lastGoalMetDateISO: '',
  totalWaterLoggedMl: 0,
  aiInsightsUsedCount: 0,
  unlockedAchievementsCount: 0,
};

export function useHydrationData(defaultGoal: number = 2000) {
  const { toast } = useToast();
  const [dailyGoal, setDailyGoalInternal] = useState<number>(defaultGoal);
  const [currentIntake, setCurrentIntakeInternal] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Achievement state
  const [achievementStats, setAchievementStatsInternal] = useState<AchievementStats>(initialAchievementStats);
  const [unlockedAchievements, setUnlockedAchievementsInternal] = useState<Set<AchievementId>>(new Set());

  const setAndStoreAchievementStats = useCallback((stats: AchievementStats) => {
    setAchievementStatsInternal(stats);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACHIEVEMENT_STATS_KEY, JSON.stringify(stats));
    }
  }, []);

  const setAndStoreUnlockedAchievements = useCallback((unlocked: Set<AchievementId>) => {
    setUnlockedAchievementsInternal(unlocked);
    if (typeof window !== 'undefined') {
      localStorage.setItem(UNLOCKED_ACHIEVEMENTS_KEY, JSON.stringify(Array.from(unlocked)));
    }
    // Update count for meta-achievements
    setAchievementStatsInternal(prevStats => {
        const newStats = {...prevStats, unlockedAchievementsCount: unlocked.size };
        if (typeof window !== 'undefined') {
            localStorage.setItem(ACHIEVEMENT_STATS_KEY, JSON.stringify(newStats));
        }
        return newStats;
    });

  }, []);


  const checkAndUnlockAchievements = useCallback((currentStats: AchievementStats, currentDailyGoal: number, currentUnlockedIds: Set<AchievementId>) => {
    const newlyUnlocked: AchievementId[] = [];
    // const todayISO = getTodayISO(); // Not used in current switch

    for (const achievement of ALL_ACHIEVEMENTS) {
      if (currentUnlockedIds.has(achievement.id)) continue;

      let unlockedThisCheck = false;
      switch (achievement.id) {
        case 'FIRST_SIP':
          unlockedThisCheck = currentStats.totalWaterLoggedMl > 0;
          break;
        case 'STAY_HYDRATED_1':
          unlockedThisCheck = currentStats.goalsMetCount >= 1;
          break;
        case 'STAY_HYDRATED_5':
          unlockedThisCheck = currentStats.goalsMetCount >= 5;
          break;
        case 'STAY_HYDRATED_10':
          unlockedThisCheck = currentStats.goalsMetCount >= 10;
          break;
        case 'STREAK_3_DAYS':
          unlockedThisCheck = currentStats.currentStreak >= 3;
          break;
        case 'STREAK_7_DAYS':
          unlockedThisCheck = currentStats.currentStreak >= 7;
          break;
        case 'STREAK_PERFECT_MONTH_APPROX':
            unlockedThisCheck = currentStats.currentStreak >= 30;
            break;
        case 'AI_CURIOUS':
          unlockedThisCheck = currentStats.aiInsightsUsedCount >= 1;
          break;
        case 'AI_EXPERT_5':
          unlockedThisCheck = currentStats.aiInsightsUsedCount >= 5;
          break;
        case 'AI_GURU_15':
            unlockedThisCheck = currentStats.aiInsightsUsedCount >= 15;
            break;
        case 'GOAL_SETTER_HIGH':
          unlockedThisCheck = currentDailyGoal >= 3000;
          break;
        case 'TOTAL_VOLUME_10L':
          unlockedThisCheck = currentStats.totalWaterLoggedMl >= 10000;
          break;
        case 'TOTAL_VOLUME_50L':
          unlockedThisCheck = currentStats.totalWaterLoggedMl >= 50000;
          break;
        // case 'ALL_STAR_COLLECTOR':
        //   unlockedThisCheck = currentUnlockedIds.size >= 5; // Check size BEFORE adding current batch
        //   break;
      }

      if (unlockedThisCheck) {
        newlyUnlocked.push(achievement.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      const updatedUnlockedSet = new Set([...currentUnlockedIds, ...newlyUnlocked]);
      setAndStoreUnlockedAchievements(updatedUnlockedSet); 
      
      const updatedStatsForMeta = {...currentStats, unlockedAchievementsCount: updatedUnlockedSet.size};


      for (const achievement of ALL_ACHIEVEMENTS) {
        if (updatedUnlockedSet.has(achievement.id) || newlyUnlocked.includes(achievement.id)) continue; 

        if (achievement.id === 'ALL_STAR_COLLECTOR' && achievement.threshold) {
           if (updatedStatsForMeta.unlockedAchievementsCount >= achievement.threshold) {
             if (!newlyUnlocked.includes(achievement.id)) { 
                newlyUnlocked.push(achievement.id); 
                updatedUnlockedSet.add(achievement.id); 
             }
           }
        }
      }
      
      if (newlyUnlocked.some(id => id === 'ALL_STAR_COLLECTOR' && !currentUnlockedIds.has('ALL_STAR_COLLECTOR'))) {
         setAndStoreUnlockedAchievements(new Set([...updatedUnlockedSet]));
      }

      newlyUnlocked.forEach(id => {
        const achievementDetails = ALL_ACHIEVEMENTS.find(a => a.id === id);
        if (achievementDetails) {
          // Defer toast to next tick to avoid updating another component during render
          setTimeout(() => {
            toast({
              title: "🏆 Achievement Unlocked!",
              description: `You've earned: ${achievementDetails.name}`,
            });
          }, 0);
        }
      });
    }
  }, [toast, setAndStoreUnlockedAchievements]);


  useEffect(() => {
    const todayISO = getTodayISO();
    const storedGoal = getStoredNumber(GOAL_KEY, defaultGoal);
    const storedIntake = getStoredNumber(INTAKE_KEY, 0);
    const lastLogDateForIntakeReset = getStoredString(LAST_LOG_DATE_KEY, '');

    setDailyGoalInternal(storedGoal);

    if (lastLogDateForIntakeReset === todayISO) {
      setCurrentIntakeInternal(storedIntake);
    } else {
      setCurrentIntakeInternal(0);
      if (typeof window !== 'undefined') {
        localStorage.setItem(INTAKE_KEY, '0');
        localStorage.setItem(LAST_LOG_DATE_KEY, todayISO);
      }
    }

    const loadedStats = getStoredJson<AchievementStats>(ACHIEVEMENT_STATS_KEY, initialAchievementStats);
    const loadedUnlockedAchievementIds = getStoredJson<AchievementId[]>(UNLOCKED_ACHIEVEMENTS_KEY, []);
    
    setAchievementStatsInternal(loadedStats); // Set initial stats
    const initialUnlockedSet = new Set(loadedUnlockedAchievementIds);
    setUnlockedAchievementsInternal(initialUnlockedSet);
    
    setIsInitialized(true);

    // Initial check for achievements.
    // It's important that loadedStats and storedGoal are the most up-to-date values here.
    checkAndUnlockAchievements(loadedStats, storedGoal, initialUnlockedSet);

  }, [defaultGoal, checkAndUnlockAchievements]); // checkAndUnlockAchievements is memoized

  const logWater = useCallback((amount: number) => {
    const todayISO = getTodayISO();
    const yesterdayISO = getYesterdayISO();
    
    setAchievementStatsInternal(prevStats => {
      let newStats = { ...prevStats };

      if (amount > 0) { 
          newStats.totalWaterLoggedMl += amount;
      }

      if (amount > 0) {
        if (newStats.lastLogDateISO === todayISO) {
          // Already logged today
        } else if (newStats.lastLogDateISO === yesterdayISO) {
          newStats.currentStreak += 1;
        } else {
          newStats.currentStreak = 1;
        }
        newStats.lastLogDateISO = todayISO;
      }
      
      setCurrentIntakeInternal(prevIntake => {
        const newIntake = Math.max(0, prevIntake + amount);
        if (typeof window !== 'undefined') {
          localStorage.setItem(INTAKE_KEY, newIntake.toString());
          localStorage.setItem(LAST_LOG_DATE_KEY, todayISO);
        }

        if (newIntake >= dailyGoal && newStats.lastGoalMetDateISO !== todayISO) {
          newStats.goalsMetCount += 1;
          newStats.lastGoalMetDateISO = todayISO;
        }
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(ACHIEVEMENT_STATS_KEY, JSON.stringify(newStats));
        }
        checkAndUnlockAchievements(newStats, dailyGoal, unlockedAchievements);
        return newIntake;
      });
      return newStats;
    });
  }, [dailyGoal, unlockedAchievements, checkAndUnlockAchievements]);

  const setDailyGoal = useCallback((goal: number) => {
    const newGoal = Math.max(500, goal);
    setDailyGoalInternal(newGoal);
    if (typeof window !== 'undefined') {
      localStorage.setItem(GOAL_KEY, newGoal.toString());
    }
    setAchievementStatsInternal(currentStats => {
        checkAndUnlockAchievements(currentStats, newGoal, unlockedAchievements);
        return currentStats; 
    });
  }, [unlockedAchievements, checkAndUnlockAchievements]);
  
  const resetIntake = useCallback(() => {
    setCurrentIntakeInternal(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem(INTAKE_KEY, '0');
      localStorage.setItem(LAST_LOG_DATE_KEY, getTodayISO());
    }
    // Optionally, you might want to re-evaluate achievements if resetting intake affects goal met status for the day
    // For now, we assume achievements are based on positive progress.
    // If a goal was met, then reset, the 'goalsMetCount' for that day is still counted unless specifically reverted.
    // The current logic doesn't revert goalsMetCount on manual reset.
    toast({
      title: "Intake Reset",
      description: "Your water intake for today has been reset to 0ml.",
    });
    // Re-check achievements in case this reset impacts any.
    // For example, if there was an achievement for *not* having 0 intake. (Not currently implemented)
    checkAndUnlockAchievements(achievementStats, dailyGoal, unlockedAchievements);

  }, [toast, achievementStats, dailyGoal, unlockedAchievements, checkAndUnlockAchievements]);

  const incrementAiInsightsUsedCount = useCallback(() => {
    setAchievementStatsInternal(prevStats => {
        const newStats = { ...prevStats, aiInsightsUsedCount: prevStats.aiInsightsUsedCount + 1 };
        if (typeof window !== 'undefined') {
          localStorage.setItem(ACHIEVEMENT_STATS_KEY, JSON.stringify(newStats));
        }
        checkAndUnlockAchievements(newStats, dailyGoal, unlockedAchievements);
        return newStats;
    });
  }, [dailyGoal, unlockedAchievements, checkAndUnlockAchievements]);

  return { 
    dailyGoal, 
    currentIntake, 
    logWater, 
    setDailyGoal, 
    resetIntake, 
    isInitialized,
    achievementStats,
    unlockedAchievements,
    incrementAiInsightsUsedCount,
    allAchievements: ALL_ACHIEVEMENTS 
  };
}


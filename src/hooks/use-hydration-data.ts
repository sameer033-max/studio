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
    setAndStoreAchievementStats({...achievementStats, unlockedAchievementsCount: unlocked.size });

  }, [achievementStats, setAndStoreAchievementStats]);


  const checkAndUnlockAchievements = useCallback((currentStats: AchievementStats, currentDailyGoal: number, currentUnlockedIds: Set<AchievementId>) => {
    const newlyUnlocked: AchievementId[] = [];
    const todayISO = getTodayISO();

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
      setAndStoreUnlockedAchievements(updatedUnlockedSet); // This will also update stats.unlockedAchievementsCount
      
      // Update stats with potentially new unlocked count for next meta check in same cycle if needed
      const updatedStatsForMeta = {...currentStats, unlockedAchievementsCount: updatedUnlockedSet.size};


      // Second pass for meta achievements that might depend on the count of achievements unlocked IN THIS VERY BATCH
      // For example, if 'ALL_STAR_COLLECTOR' (unlock 5 others) is being checked.
      for (const achievement of ALL_ACHIEVEMENTS) {
        if (updatedUnlockedSet.has(achievement.id) || newlyUnlocked.includes(achievement.id)) continue; // Already processed or newly added

        if (achievement.id === 'ALL_STAR_COLLECTOR' && achievement.threshold) {
           // Check if the threshold (e.g., 5) is met by the size of the updatedUnlockedSet
           if (updatedStatsForMeta.unlockedAchievementsCount >= achievement.threshold) {
             if (!newlyUnlocked.includes(achievement.id)) { // ensure not to double-add if somehow already processed
                newlyUnlocked.push(achievement.id); // Add to newlyUnlocked to get a toast
                updatedUnlockedSet.add(achievement.id); // Add to the main set
             }
           }
        }
      }
      
      if (newlyUnlocked.length > 0) {
        // Re-set unlocked achievements if meta achievements were added
         setAndStoreUnlockedAchievements(new Set([...updatedUnlockedSet]));
      }


      newlyUnlocked.forEach(id => {
        const achievementDetails = ALL_ACHIEVEMENTS.find(a => a.id === id);
        if (achievementDetails) {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `You've earned: ${achievementDetails.name}`,
          });
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

    // Load achievement data
    const loadedStats = getStoredJson<AchievementStats>(ACHIEVEMENT_STATS_KEY, initialAchievementStats);
    const loadedUnlockedAchievementIds = getStoredJson<AchievementId[]>(UNLOCKED_ACHIEVEMENTS_KEY, []);
    
    setAchievementStatsInternal(loadedStats);
    setUnlockedAchievementsInternal(new Set(loadedUnlockedAchievementIds));
    
    setIsInitialized(true);

    // Initial check for achievements that might be met by stored data (e.g. high goal set previously)
    // Need to ensure dailyGoal is set before this check if it relies on it.
    // The checkAndUnlockAchievements needs the current dailyGoal from state.
    // So, it's better to call it after dailyGoal is confirmed.
    // This useEffect runs once. Subsequent calls to setDailyGoal will trigger it.
    if (storedGoal) { // ensure storedGoal is loaded
        checkAndUnlockAchievements(loadedStats, storedGoal, new Set(loadedUnlockedAchievementIds));
    }

  }, [defaultGoal, checkAndUnlockAchievements]); // checkAndUnlockAchievements is memoized

  const logWater = useCallback((amount: number) => {
    const todayISO = getTodayISO();
    const yesterdayISO = getYesterdayISO();
    let newStats = { ...achievementStats };

    setCurrentIntakeInternal(prevIntake => {
      const newIntake = Math.max(0, prevIntake + amount);
      if (typeof window !== 'undefined') {
        localStorage.setItem(INTAKE_KEY, newIntake.toString());
        localStorage.setItem(LAST_LOG_DATE_KEY, todayISO);
      }

      // Update total water logged
      if (amount > 0) { // Only add positive amounts to total logged for achievements
          newStats.totalWaterLoggedMl += amount;
      }


      // Streak logic (only if water is added, not removed)
      if (amount > 0) {
        if (newStats.lastLogDateISO === todayISO) {
          // Already logged today, streak doesn't change
        } else if (newStats.lastLogDateISO === yesterdayISO) {
          newStats.currentStreak += 1;
        } else {
          // Missed a day or first log
          newStats.currentStreak = 1;
        }
        newStats.lastLogDateISO = todayISO;
      }
      
      // Goal met logic
      if (newIntake >= dailyGoal && newStats.lastGoalMetDateISO !== todayISO) {
        newStats.goalsMetCount += 1;
        newStats.lastGoalMetDateISO = todayISO;
      }
      
      setAndStoreAchievementStats(newStats);
      checkAndUnlockAchievements(newStats, dailyGoal, unlockedAchievements);
      return newIntake;
    });
  }, [achievementStats, dailyGoal, unlockedAchievements, checkAndUnlockAchievements, setAndStoreAchievementStats]);

  const setDailyGoal = useCallback((goal: number) => {
    const newGoal = Math.max(500, goal);
    setDailyGoalInternal(newGoal);
    if (typeof window !== 'undefined') {
      localStorage.setItem(GOAL_KEY, newGoal.toString());
    }
    // Check achievements after goal change (e.g., for GOAL_SETTER_HIGH)
    checkAndUnlockAchievements(achievementStats, newGoal, unlockedAchievements);
  }, [achievementStats, unlockedAchievements, checkAndUnlockAchievements]);
  
  const resetIntake = useCallback(() => {
    setCurrentIntakeInternal(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem(INTAKE_KEY, '0');
      localStorage.setItem(LAST_LOG_DATE_KEY, getTodayISO());
    }
    // Resetting intake doesn't reset streaks or other achievement stats unless it's a new day.
    // This function is for manual reset on the same day.
  }, []);

  const incrementAiInsightsUsedCount = useCallback(() => {
    const newStats = { ...achievementStats, aiInsightsUsedCount: achievementStats.aiInsightsUsedCount + 1 };
    setAndStoreAchievementStats(newStats);
    checkAndUnlockAchievements(newStats, dailyGoal, unlockedAchievements);
  }, [achievementStats, dailyGoal, unlockedAchievements, checkAndUnlockAchievements, setAndStoreAchievementStats]);

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
    allAchievements: ALL_ACHIEVEMENTS // Expose all defined achievements for the UI
  };
}

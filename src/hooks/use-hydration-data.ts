"use client";

import { useState, useEffect, useCallback } from 'react';

const GOAL_KEY = 'hydratewise_hydrationGoal';
const INTAKE_KEY = 'hydratewise_hydrationIntake';
const LAST_LOG_DATE_KEY = 'hydratewise_hydrationLastLogDate';

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

export function useHydrationData(defaultGoal: number = 2000) {
  const [dailyGoal, setDailyGoalInternal] = useState<number>(defaultGoal);
  const [currentIntake, setCurrentIntakeInternal] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const storedGoal = getStoredNumber(GOAL_KEY, defaultGoal);
    const storedIntake = getStoredNumber(INTAKE_KEY, 0);
    const lastLogDate = getStoredString(LAST_LOG_DATE_KEY, '');

    setDailyGoalInternal(storedGoal);

    if (lastLogDate === today) {
      setCurrentIntakeInternal(storedIntake);
    } else {
      // New day, reset intake
      setCurrentIntakeInternal(0);
      if (typeof window !== 'undefined') {
        localStorage.setItem(INTAKE_KEY, '0');
        localStorage.setItem(LAST_LOG_DATE_KEY, today);
      }
    }
    setIsInitialized(true);
  }, [defaultGoal]);

  const logWater = useCallback((amount: number) => {
    setCurrentIntakeInternal(prevIntake => {
      const newIntake = Math.max(0, prevIntake + amount); // Ensure intake doesn't go below 0
      if (typeof window !== 'undefined') {
        localStorage.setItem(INTAKE_KEY, newIntake.toString());
        localStorage.setItem(LAST_LOG_DATE_KEY, new Date().toLocaleDateString());
      }
      return newIntake;
    });
  }, []);

  const setDailyGoal = useCallback((goal: number) => {
    const newGoal = Math.max(500, goal); // Minimum goal of 500ml
    setDailyGoalInternal(newGoal);
    if (typeof window !== 'undefined') {
      localStorage.setItem(GOAL_KEY, newGoal.toString());
    }
  }, []);
  
  const resetIntake = useCallback(() => {
    setCurrentIntakeInternal(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem(INTAKE_KEY, '0');
      localStorage.setItem(LAST_LOG_DATE_KEY, new Date().toLocaleDateString());
    }
  }, []);

  return { dailyGoal, currentIntake, logWater, setDailyGoal, resetIntake, isInitialized };
}
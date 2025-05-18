
"use client";

import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

const REMINDER_INTERVAL = 3600000; // 1 hour in milliseconds

export function AppReminderManager() {
  const { toast } = useToast();

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    const showReminderToast = () => {
      toast({
        title: "Hydration Reminder!",
        description: "Don't forget to drink some water. Stay refreshed!",
        duration: 10000, // Show for 10 seconds
      });
    };

    const scheduleReminder = () => {
      if (typeof document !== 'undefined') {
        timerId = setTimeout(() => {
          if (document.visibilityState === 'visible') { // Only show if tab is active/app is visible
            showReminderToast();
          }
          scheduleReminder(); // Schedule the next one
        }, REMINDER_INTERVAL);
      }
    };

    scheduleReminder();

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [toast]);

  return null; // This component does not render any UI
}

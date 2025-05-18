
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const REMINDER_INTERVAL = 3600000; // 1 hour in milliseconds
const LOCAL_STORAGE_REMINDERS_ACTIVE_KEY = 'hydratewise_inAppRemindersActive';

export function SmartReminderInfo() {
  const [inAppRemindersActive, setInAppRemindersActive] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { toast } = useToast();

  // Load initial reminder state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRemindersActive = localStorage.getItem(LOCAL_STORAGE_REMINDERS_ACTIVE_KEY);
      setInAppRemindersActive(storedRemindersActive === 'true');
    }
    setIsInitialized(true);
  }, []);

  // Effect to manage the reminder interval using toasts
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
      if (inAppRemindersActive && typeof document !== 'undefined') {
        timerId = setTimeout(() => {
          if (document.visibilityState === 'visible') { // Only show if tab is active
            showReminderToast();
          }
          scheduleReminder(); // Schedule the next one
        }, REMINDER_INTERVAL);
      }
    };

    if (isInitialized && inAppRemindersActive) {
      scheduleReminder();
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [inAppRemindersActive, toast, isInitialized]);

  const handleToggleReminders = () => {
    const newActiveState = !inAppRemindersActive;
    setInAppRemindersActive(newActiveState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_REMINDERS_ACTIVE_KEY, newActiveState.toString());
    }
    toast({
      title: newActiveState ? "In-App Reminders Enabled" : "In-App Reminders Disabled",
      description: newActiveState 
        ? "You'll receive hourly in-app reminders while this page is open and active."
        : "In-app hydration reminders have been turned off.",
    });
  };

  if (!isInitialized) {
    return (
      <Card className="shadow-lg w-full bg-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BellRing className="h-6 w-6 text-primary" /> Smart In-App Reminders</CardTitle>
          <CardDescription>Loading reminder settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse text-muted-foreground">Initializing...</div>
        </CardContent>
      </Card>
    );
  }

  const cardDescriptionText = inAppRemindersActive
    ? "Hourly in-app hydration reminders are currently active!"
    : "Enable hourly in-app notifications to remind you to drink water.";
  
  const contentText = inAppRemindersActive
    ? "You are set to receive an in-app notification every hour to remind you to drink water, as long as this page is open and active in your browser."
    : "To stay on top of your hydration, you can enable in-app reminders. You'll get a notification within this app each hour as long as this page is open and active.";

  return (
    <Card className="shadow-lg w-full bg-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {inAppRemindersActive ? <BellRing className="h-6 w-6 text-primary" /> : <BellOff className="h-6 w-6 text-muted-foreground" />}
           Smart In-App Reminders
        </CardTitle>
        <CardDescription>
          {cardDescriptionText} These reminders only work when this page is open and active in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {contentText}
        </p>
        <Button onClick={handleToggleReminders} className="w-full sm:w-auto">
          {inAppRemindersActive ? (
            <>
              <BellOff className="mr-2 h-4 w-4" /> Disable In-App Reminders
            </>
          ) : (
            <>
              <BellRing className="mr-2 h-4 w-4" /> Enable Hourly In-App Reminders
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}


"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing } from "lucide-react"; // Removed BellOff
import { useToast } from "@/hooks/use-toast";

const REMINDER_INTERVAL = 3600000; // 1 hour in milliseconds

export function SmartReminderInfo() {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // This effect is just to set isInitialized to true after the component mounts
    // to ensure any initial client-side checks are ready.
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
      // Reminders are always active now
      if (typeof document !== 'undefined') {
        timerId = setTimeout(() => {
          if (document.visibilityState === 'visible') { // Only show if tab is active/app is visible
            showReminderToast();
          }
          scheduleReminder(); // Schedule the next one
        }, REMINDER_INTERVAL);
      }
    };

    if (isInitialized) {
      scheduleReminder();
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [toast, isInitialized]);


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

  const cardDescriptionText = "Hourly in-app hydration reminders are active!";
  
  const contentText = "To help you stay on top of your hydration, you'll receive an in-app notification every hour. These reminders only work when HydrateWise is open and active on your device.";

  return (
    <Card className="shadow-lg w-full bg-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-6 w-6 text-primary" />
           Smart In-App Reminders
        </CardTitle>
        <CardDescription>
          {cardDescriptionText}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {contentText}
        </p>
        {/* Button to toggle reminders has been removed */}
      </CardContent>
    </Card>
  );
}


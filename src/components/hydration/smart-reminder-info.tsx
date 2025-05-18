
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const REMINDER_INTERVAL = 3600000; // 1 hour in milliseconds
const LOCAL_STORAGE_REMINDERS_ACTIVE_KEY = 'hydratewise_remindersActive';

export function SmartReminderInfo() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [remindersActive, setRemindersActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check initial permission status and stored preference
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
      const storedRemindersActive = localStorage.getItem(LOCAL_STORAGE_REMINDERS_ACTIVE_KEY);
      if (storedRemindersActive === 'true' && Notification.permission === 'granted') {
        setRemindersActive(true);
      } else {
        setRemindersActive(false);
        // Ensure localStorage reflects disabled state if permission not granted or preference was off
        if (Notification.permission !== 'granted' || storedRemindersActive !== 'true') {
            localStorage.setItem(LOCAL_STORAGE_REMINDERS_ACTIVE_KEY, 'false');
        }
      }
    } else {
      // Notifications not supported
      setPermissionStatus('denied'); 
      setRemindersActive(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_REMINDERS_ACTIVE_KEY, 'false');
      }
    }
    setIsLoading(false);
  }, []);

  // Effect to manage the reminder interval
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (remindersActive && permissionStatus === 'granted') {
      intervalId = setInterval(() => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification("HydrateWise Reminder", {
            body: "It's time to drink some water! Stay hydrated.",
          });
        }
      }, REMINDER_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [remindersActive, permissionStatus]);

  const handleEnableReminders = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast({
        title: "Unsupported Feature",
        description: "Your browser does not support desktop notifications.",
        variant: "destructive",
      });
      setPermissionStatus('denied');
      return;
    }

    if (permissionStatus === 'granted') {
      setRemindersActive(true);
      localStorage.setItem(LOCAL_STORAGE_REMINDERS_ACTIVE_KEY, 'true');
      toast({
        title: "Reminders Enabled",
        description: "You'll receive hourly hydration reminders if this page is open.",
      });
      return;
    }

    if (permissionStatus === 'denied') {
      toast({
        title: "Permission Denied",
        description: "Notification permissions are blocked. Please enable them in your browser settings for HydrateWise to activate reminders.",
        variant: "destructive",
      });
      return;
    }

    // 'default' state, request permission
    try {
      const currentPermission = await Notification.requestPermission();
      setPermissionStatus(currentPermission);

      if (currentPermission === 'granted') {
        setRemindersActive(true);
        localStorage.setItem(LOCAL_STORAGE_REMINDERS_ACTIVE_KEY, 'true');
        toast({
          title: "Reminders Enabled!",
          description: "You'll receive hourly hydration reminders if this page is open.",
        });
      } else {
        setRemindersActive(false);
        localStorage.setItem(LOCAL_STORAGE_REMINDERS_ACTIVE_KEY, 'false');
        toast({
          title: "Permission Not Granted",
          description: "Reminders cannot be enabled without notification permission.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast({
        title: "Error",
        description: "Could not request notification permission.",
        variant: "destructive",
      });
    }
  };

  const handleDisableReminders = () => {
    setRemindersActive(false);
    localStorage.setItem(LOCAL_STORAGE_REMINDERS_ACTIVE_KEY, 'false');
    toast({
      title: "Reminders Disabled",
      description: "Hourly hydration reminders have been turned off.",
    });
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg w-full bg-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BellRing className="h-6 w-6 text-primary" /> Smart Reminders</CardTitle>
          <CardDescription>Loading reminder settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse text-muted-foreground">Checking notification permissions...</div>
        </CardContent>
      </Card>
    );
  }

  let cardDescriptionText = "Enable hourly browser notifications to remind you to drink water.";
  let contentText = "To stay on top of your hydration, you can enable reminders. You'll get a notification each hour as long as this page is open in your browser.";

  if (permissionStatus === 'denied') {
     cardDescriptionText = "Notification permission is required for reminders.";
     contentText = "To use reminders, please grant notification permission to HydrateWise in your browser settings, then try enabling reminders again.";
     if (localStorage.getItem(LOCAL_STORAGE_REMINDERS_ACTIVE_KEY) === 'true') { // Was active but now denied
        cardDescriptionText = "Notification permission was denied or revoked.";
        contentText = "Reminders were active but notification permission is now denied. Please re-enable permissions in your browser settings if you want to receive reminders.";
     }
  } else if (remindersActive) {
     cardDescriptionText = "Hourly hydration reminders are currently active!";
     contentText = "You are set to receive a browser notification every hour to remind you to drink water, as long as this page remains open.";
  }


  return (
    <Card className="shadow-lg w-full bg-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {remindersActive && permissionStatus === 'granted' ? <BellRing className="h-6 w-6 text-primary" /> : <BellOff className="h-6 w-6 text-muted-foreground" />}
           Smart Reminders
        </CardTitle>
        <CardDescription>
          {cardDescriptionText}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {contentText}
        </p>
        {permissionStatus !== 'denied' && !remindersActive && (
          <Button onClick={handleEnableReminders} className="w-full sm:w-auto">
            <BellRing className="mr-2 h-4 w-4" /> Enable Hourly Reminders
          </Button>
        )}
        {remindersActive && permissionStatus === 'granted' && (
          <Button onClick={handleDisableReminders} variant="outline" className="w-full sm:w-auto">
            <BellOff className="mr-2 h-4 w-4" /> Disable Reminders
          </Button>
        )}
         {permissionStatus === 'denied' && (
           <Button onClick={handleEnableReminders} className="w-full sm:w-auto" title="Attempt to request permission or check status.">
            <BellRing className="mr-2 h-4 w-4" /> Check/Request Permission
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

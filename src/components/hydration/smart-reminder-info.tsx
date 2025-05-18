"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing } from "lucide-react";

export function SmartReminderInfo() {
  return (
    <Card className="shadow-lg w-full bg-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BellRing className="h-6 w-6 text-primary" /> Smart Reminders</CardTitle>
        <CardDescription>
          Stay on track with your hydration! In a full mobile app experience, you'd be able to set custom reminders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          For now, remember to take regular sips throughout the day. You can use your phone's built-in reminder app to set hydration alerts.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Future updates might include browser-based notifications if you keep this page open.
        </p>
      </CardContent>
    </Card>
  );
}
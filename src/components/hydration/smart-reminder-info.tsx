
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing } from "lucide-react";

export function SmartReminderInfo() {
  return (
    <Card className="shadow-lg w-full bg-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BellRing className="h-6 w-6 text-primary" /> Smart Reminders</CardTitle>
        <CardDescription>
          Currently, HydrateWise doesn't have an active, built-in notification system to remind you to drink water.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          In a full mobile app experience, you would typically be able to set custom reminders. For now, remember to take regular sips throughout the day. You can use your phone's built-in reminder app to set hydration alerts.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Future updates might include browser-based notifications if you keep this page open.
        </p>
      </CardContent>
    </Card>
  );
}


"use client";

import React, { useState, useMemo, useCallback } from 'react'; 
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, Bot } from 'lucide-react';
import { getPersonalizedHydrationInsights, PersonalizedHydrationInsightsInput, PersonalizedHydrationInsightsOutput } from '@/ai/flows/personalized-hydration-insights';
import { useToast } from "@/hooks/use-toast";

const insightsSchema = z.object({
  activityLevel: z.enum(["sedentary", "moderate", "active"], { required_error: "Activity level is required."}),
  weather: z.string().min(3, "Weather description is too short.").max(50, "Weather description is too long."),
  sleepDuration: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().min(0, "Sleep duration cannot be negative.").max(24, "Sleep duration seems too high.")
  ),
  weight: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().min(1, "Weight must be a positive number.").max(500, "Weight seems too high.")
  ),
});

type InsightsFormValues = z.infer<typeof insightsSchema>;

interface AiInsightsToolProps {
  onInsightGenerated: () => void; // Callback to notify parent about AI usage
}

export function AiInsightsTool({ onInsightGenerated }: AiInsightsToolProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<PersonalizedHydrationInsightsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<InsightsFormValues>({
    resolver: zodResolver(insightsSchema),
    defaultValues: {
      activityLevel: "moderate",
      weather: "",
      sleepDuration: 8,
      weight: 70,
    },
  });

  const onSubmit = useCallback(async (data: InsightsFormValues) => {
    setIsLoading(true);
    setInsights(null);
    setError(null);
    try {
      const result = await getPersonalizedHydrationInsights(data as PersonalizedHydrationInsightsInput);
      setInsights(result);
      toast({
        title: "Insights Generated!",
        description: "Your personalized hydration tips are ready.",
      });
      onInsightGenerated(); // Notify parent that AI was used
    } catch (e) {
      console.error("Error fetching AI insights:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate insights. ${errorMessage}`);
      toast({
        title: "Error",
        description: "Could not fetch AI insights.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onInsightGenerated, toast]);

  const activityLevelSelectValue = useMemo(() => (
    <SelectValue placeholder="Select activity level" />
  ), []);

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6 text-primary" /> AI Hydration Insights</CardTitle>
        <CardDescription>Get personalized hydration recommendations based on your activity, weather, sleep, and weight.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          {activityLevelSelectValue}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weather"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Weather</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Hot and sunny" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sleepDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep Duration (hours)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" placeholder="e.g., 7.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="e.g., 65" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Get Insights
            </Button>
          </CardFooter>
        </form>
      </Form>

      {error && (
        <div className="p-6 pt-0">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {insights && (
        <div className="p-6 pt-0">
          <Alert variant="default" className="bg-accent/30 border-accent">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
            <AlertTitle className="font-semibold text-accent-foreground">Personalized Hydration Tip</AlertTitle>
            <AlertDescription className="text-accent-foreground/90">
              <p className="mt-1">{insights.hydrationMessage}</p>
              <p className="mt-2 font-medium">Suggested Daily Intake: {insights.suggestedIntakeOz} oz (approx. {Math.round(insights.suggestedIntakeOz * 29.5735)}ml)</p>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}

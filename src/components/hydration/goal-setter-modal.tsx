"use client";

import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Target } from 'lucide-react';

const goalSchema = z.object({
  goal: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().min(500, "Goal must be at least 500ml.").max(10000, "Goal cannot exceed 10,000ml.")
  ),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalSetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: number;
  onSetGoal: (goal: number) => void;
}

export function GoalSetterModal({ isOpen, onClose, currentGoal, onSetGoal }: GoalSetterModalProps) {
  const { toast } = useToast();
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goal: currentGoal,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ goal: currentGoal });
    }
  }, [isOpen, currentGoal, form]);

  function onSubmit(data: GoalFormValues) {
    onSetGoal(data.goal);
    toast({
      title: "Goal Updated!",
      description: `Your new daily hydration goal is ${data.goal}ml.`,
    });
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Target className="h-6 w-6 text-primary"/>Set Your Daily Hydration Goal</DialogTitle>
          <DialogDescription>
            Personalize your daily water intake goal in milliliters (ml). Recommended minimum is 500ml.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Goal (ml)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Goal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
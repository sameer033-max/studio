
"use client";

import React, { useState, useMemo } from 'react'; // Added useMemo
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassWater, PlusCircle, MinusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const logWaterSchema = z.object({
  customAmount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Please enter a valid amount.",
  }).optional(),
  presetAmount: z.string().optional(),
});

type LogWaterFormValues = z.infer<typeof logWaterSchema>;

interface LogWaterFormProps {
  onLogWater: (amount: number) => void;
}

const presets = [
  { label: "Small Glass (150ml)", value: 150 },
  { label: "Glass (250ml)", value: 250 },
  { label: "Small Bottle (330ml)", value: 330 },
  { label: "Bottle (500ml)", value: 500 },
  { label: "Large Bottle (750ml)", value: 750 },
];

const formatVolume = (ml: number): string => {
  if (ml >= 1000) {
    const liters = (ml / 1000).toFixed(1);
    const formattedLiters = liters.endsWith('.0') ? liters.substring(0, liters.length - 2) : liters;
    return `${ml}ml (${formattedLiters}L)`;
  }
  return `${ml}ml`;
};

export function LogWaterForm({ onLogWater }: LogWaterFormProps) {
  const { toast } = useToast();
  const form = useForm<LogWaterFormValues>({
    resolver: zodResolver(logWaterSchema),
    defaultValues: {
      customAmount: "",
      presetAmount: "",
    },
  });

  const [isCustom, setIsCustom] = useState(false);

  function onSubmit(data: LogWaterFormValues) {
    let amount = 0;
    if (isCustom && data.customAmount) {
      amount = parseFloat(data.customAmount);
    } else if (!isCustom && data.presetAmount) {
      amount = parseFloat(data.presetAmount);
    }

    if (amount > 0) {
      onLogWater(amount);
      toast({
        title: "Water Logged!",
        description: `${formatVolume(amount)} added to your daily intake.`,
      });
      form.reset();
      setIsCustom(false); // Reset to preset view
    } else {
       toast({
        title: "Error",
        description: "Please select a preset or enter a custom amount.",
        variant: "destructive",
      });
    }
  }
  
  const handlePresetQuickAdd = (amount: number) => {
    onLogWater(amount);
    toast({
      title: "Water Logged!",
      description: `${formatVolume(amount)} added to your daily intake.`,
    });
  };

  const presetAmountSelectValue = useMemo(() => (
    <SelectValue placeholder="Select a preset amount" />
  ), []);

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><GlassWater className="h-6 w-6 text-primary" /> Log Water Intake</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {presets.slice(0,3).map(p => (
                <Button type="button" key={p.value} variant="outline" onClick={() => handlePresetQuickAdd(p.value)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> {p.value}ml
                </Button>
              ))}
            </div>
            
            {!isCustom ? (
              <FormField
                control={form.control}
                name="presetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose a preset</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      setIsCustom(false);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          {presetAmountSelectValue}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {presets.map((preset) => (
                          <SelectItem key={preset.value} value={preset.value.toString()}>
                            {preset.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="customAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Or enter custom amount (ml)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 300" {...field} 
                        onChange={e => {
                          field.onChange(e.target.value);
                          form.setValue('presetAmount', ''); // Clear preset if custom is used
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="button" variant="link" onClick={() => setIsCustom(!isCustom)} className="p-0 h-auto">
              {isCustom ? "Use Presets Instead" : "Enter Custom Amount"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <Button type="submit" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add to Intake
            </Button>
             <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => {
                const customVal = form.getValues().customAmount;
                const presetVal = form.getValues().presetAmount;
                let amountToRemove = 0;

                if (isCustom && customVal) {
                    amountToRemove = parseFloat(customVal);
                } else if (!isCustom && presetVal) {
                    amountToRemove = parseFloat(presetVal);
                }
                
                if (amountToRemove > 0) {
                    onLogWater(-amountToRemove); // Pass negative value to subtract
                    toast({
                        title: "Water Removed",
                        description: `${formatVolume(amountToRemove)} removed from your intake.`,
                    });
                } else {
                     toast({
                        title: "Select Amount",
                        description: "Please select or enter an amount to remove.",
                        variant: "destructive",
                    });
                }
             }}>
              <MinusCircle className="mr-2 h-4 w-4" /> Remove Amount
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

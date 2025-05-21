
"use client";

import React, { useState, useMemo, useCallback } from 'react';
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
  customAmount: z.string().refine(val => {
    if (val === "") return true; // Allow empty string, parseFloat handles it as NaN
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "Please enter a positive number.",
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

  const onSubmit = useCallback((data: LogWaterFormValues) => {
    let amount = 0;
    const customValFloat = data.customAmount ? parseFloat(data.customAmount) : 0;
    const presetValFloat = data.presetAmount ? parseFloat(data.presetAmount) : 0;

    if (isCustom && data.customAmount && customValFloat > 0) {
      amount = customValFloat;
    } else if (!isCustom && data.presetAmount && presetValFloat > 0) {
      amount = presetValFloat;
    }

    if (amount > 0) {
      onLogWater(amount);
      toast({
        title: "Water Logged!",
        description: `${formatVolume(amount)} added to your daily intake.`,
      });
      form.reset({ customAmount: "", presetAmount: "" });
      setIsCustom(false); // Reset to preset view
    } else {
       toast({
        title: "Error",
        description: "Please select a preset or enter a valid custom amount.",
        variant: "destructive",
      });
    }
  }, [onLogWater, toast, form, isCustom]);
  
  const handlePresetQuickAdd = useCallback((amount: number) => {
    onLogWater(amount);
    toast({
      title: "Water Logged!",
      description: `${formatVolume(amount)} added to your daily intake.`,
    });
  }, [onLogWater, toast]);

  const presetAmountSelectValue = useMemo(() => (
    <SelectValue placeholder="Select a preset amount" />
  ), []);

  const handlePresetAmountChange = useCallback((value: string, fieldOnChange: (value: string) => void) => {
    fieldOnChange(value); 
    form.setValue('customAmount', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false }); 
    setIsCustom(false);
  }, [form]); // Removed setIsCustom from deps as it's a state setter

  const handleCustomAmountChange = useCallback((currentValue: string, fieldOnChange: (value: string) => void) => {
    fieldOnChange(currentValue);
    form.setValue('presetAmount', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false });
    setIsCustom(true);
  }, [form]); // Removed setIsCustom from deps


  const toggleInputType = useCallback(() => {
    const newIsCustom = !isCustom;
    setIsCustom(newIsCustom);
    if (newIsCustom) { 
        form.setValue('presetAmount', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false });
    } else { 
        form.setValue('customAmount', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false });
    }
  }, [isCustom, form]); // Removed setIsCustom from deps

  const handleRemoveAmount = useCallback(() => {
    const customVal = form.getValues().customAmount;
    const presetVal = form.getValues().presetAmount;
    let amountToRemove = 0;

    const customValFloat = customVal ? parseFloat(customVal) : 0;
    const presetValFloat = presetVal ? parseFloat(presetVal) : 0;

    if (isCustom && customVal && customValFloat > 0) {
        amountToRemove = customValFloat;
    } else if (!isCustom && presetVal && presetValFloat > 0) {
        amountToRemove = presetValFloat;
    }
    
    if (amountToRemove > 0) {
        onLogWater(-amountToRemove); 
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
  }, [form, isCustom, onLogWater, toast]);

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
                    <Select 
                      onValueChange={(value) => handlePresetAmountChange(value, field.onChange)} 
                      value={field.value}
                    >
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
                        onChange={e => handleCustomAmountChange(e.target.value, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="button" variant="link" onClick={toggleInputType} className="p-0 h-auto">
              {isCustom ? "Use Presets Instead" : "Enter Custom Amount"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <Button type="submit" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add to Intake
            </Button>
             <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={handleRemoveAmount}>
              <MinusCircle className="mr-2 h-4 w-4" /> Remove Amount
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// src/ai/flows/daily-hydration-tip.ts
'use server';

/**
 * @fileOverview Provides a daily AI-generated hydration tip to the user.
 *
 * - getDailyHydrationTip - A function that returns a daily hydration tip.
 * - DailyHydrationTipInput - The input type for the getDailyHydrationTip function.
 * - DailyHydrationTipOutput - The return type for the getDailyHydrationTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyHydrationTipInputSchema = z.object({
  activityLevel: z
    .string()
    .describe(
      'The users daily activity level, can be one of sedentary, light, moderate, or active.'
    ),
  weightInKilograms: z
    .number()
    .describe('The weight of the user in kilograms.'),
  weather: z.string().describe('The current weather conditions'),
});
export type DailyHydrationTipInput = z.infer<typeof DailyHydrationTipInputSchema>;

const DailyHydrationTipOutputSchema = z.object({
  tip: z.string().describe('A tip to help the user stay hydrated.'),
});
export type DailyHydrationTipOutput = z.infer<typeof DailyHydrationTipOutputSchema>;

export async function getDailyHydrationTip(input: DailyHydrationTipInput): Promise<DailyHydrationTipOutput> {
  return dailyHydrationTipFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyHydrationTipPrompt',
  input: {schema: DailyHydrationTipInputSchema},
  output: {schema: DailyHydrationTipOutputSchema},
  prompt: `You are a hydration expert. Generate a single, actionable tip to help the user stay hydrated, given their activity level, weight, and the current weather.

Activity Level: {{{activityLevel}}}
Weight (kg): {{{weightInKilograms}}}
Weather: {{{weather}}}

Tip:`,
});

const dailyHydrationTipFlow = ai.defineFlow(
  {
    name: 'dailyHydrationTipFlow',
    inputSchema: DailyHydrationTipInputSchema,
    outputSchema: DailyHydrationTipOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

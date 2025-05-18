// The directive tells the JavaScript engine that this code should be executed in 'strict' mode.
'use server';

/**
 * @fileOverview Provides AI-driven personalized hydration insights based on user data.
 *
 * - `getPersonalizedHydrationInsights` - A function that returns personalized hydration insights.
 * - `PersonalizedHydrationInsightsInput` - The input type for the getPersonalizedHydrationInsights function.
 * - `PersonalizedHydrationInsightsOutput` - The return type for the getPersonalizedHydrationInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedHydrationInsightsInputSchema = z.object({
  activityLevel: z
    .string()
    .describe('The user activity level (e.g., sedentary, moderate, active).'),
  weather: z.string().describe('The current weather conditions (e.g., hot, cold, humid).'),
  sleepDuration: z
    .number()
    .describe('The user sleep duration in hours from fitness tracker.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
});
export type PersonalizedHydrationInsightsInput = z.infer<
  typeof PersonalizedHydrationInsightsInputSchema
>;

const PersonalizedHydrationInsightsOutputSchema = z.object({
  hydrationMessage: z
    .string()
    .describe('A personalized hydration recommendation message for the user.'),
  suggestedIntakeOz: z.number().describe('The suggested daily water intake in ounces.'),
});
export type PersonalizedHydrationInsightsOutput = z.infer<
  typeof PersonalizedHydrationInsightsOutputSchema
>;

export async function getPersonalizedHydrationInsights(
  input: PersonalizedHydrationInsightsInput
): Promise<PersonalizedHydrationInsightsOutput> {
  return personalizedHydrationInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHydrationInsightsPrompt',
  input: {schema: PersonalizedHydrationInsightsInputSchema},
  output: {schema: PersonalizedHydrationInsightsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized hydration advice.

  Based on the user's activity level, weather conditions, sleep duration, and weight,
  recommend optimal water intake and provide a motivating message.

  Activity Level: {{{activityLevel}}}
  Weather: {{{weather}}}
  Sleep Duration: {{{sleepDuration}}} hours
  Weight: {{{weight}}} kg

  Respond with a message that is no more than 100 words. Also provide suggestedIntakeOz based on all parameters, using this formula: (weight * 0.67) + (activityLevel == "active" ? 20 : 0) + (weather == "hot" ? 15 : 0) + (sleepDuration < 6 ? 10 : 0)
  Ensure that the hydrationMessage is tailored to these values.
  `,
});

const personalizedHydrationInsightsFlow = ai.defineFlow(
  {
    name: 'personalizedHydrationInsightsFlow',
    inputSchema: PersonalizedHydrationInsightsInputSchema,
    outputSchema: PersonalizedHydrationInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

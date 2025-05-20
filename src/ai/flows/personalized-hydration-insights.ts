// src/ai/flows/personalized-hydration-insights.ts
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

// This is the schema for the LLM's direct output
const LLMHydrationMessageSchema = z.object({
  hydrationMessage: z
    .string()
    .describe('A personalized hydration recommendation message for the user, no more than 100 words.'),
});

// This is the final output schema for the entire flow
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

// This prompt asks the LLM only for the hydration message
const hydrationMessagePrompt = ai.definePrompt({
  name: 'hydrationMessagePrompt',
  input: {schema: PersonalizedHydrationInsightsInputSchema},
  output: {schema: LLMHydrationMessageSchema},
  prompt: `You are an AI assistant designed to provide personalized hydration advice.

  Based on the user's activity level, weather conditions, sleep duration, and weight,
  provide a motivating hydration message.

  Activity Level: {{{activityLevel}}}
  Weather: {{{weather}}}
  Sleep Duration: {{{sleepDuration}}} hours
  Weight: {{{weight}}} kg

  Ensure that the hydrationMessage is tailored to these values and is no more than 100 words.
  Respond with a JSON object containing only the "hydrationMessage" key.`,
});

const personalizedHydrationInsightsFlow = ai.defineFlow(
  {
    name: 'personalizedHydrationInsightsFlow',
    inputSchema: PersonalizedHydrationInsightsInputSchema,
    outputSchema: PersonalizedHydrationInsightsOutputSchema,
  },
  async (input: PersonalizedHydrationInsightsInput): Promise<PersonalizedHydrationInsightsOutput> => {
    // Get the hydration message from the LLM
    const { output: llmOutput } = await hydrationMessagePrompt(input);

    if (!llmOutput?.hydrationMessage) {
      console.error('LLM did not return a valid hydrationMessage. Output:', llmOutput);
      throw new Error('The AI failed to generate a hydration message. Please try again.');
    }

    // Calculate suggestedIntakeOz in TypeScript
    // Formula: (weight_kg * 2.20462 * 0.5) oz is a common base, then adjust.
    // A simpler approach for oz: (weight_kg * 0.67) from original prompt seems to be oz directly for base.
    // (weight * 0.67) + (activityLevel == "active" ? 20 : 0) + (weather == "hot" ? 15 : 0) + (sleepDuration < 6 ? 10 : 0)
    
    let suggestedIntakeOz = input.weight * 0.67; // Base intake in oz

    if (input.activityLevel.toLowerCase() === "active") {
      suggestedIntakeOz += 20;
    }

    const weatherDescription = input.weather.toLowerCase();
    if (weatherDescription.includes("hot") || weatherDescription.includes("warm") || weatherDescription.includes("sunny") || weatherDescription.includes("humid")) {
      suggestedIntakeOz += 15;
    }

    if (input.sleepDuration < 6) {
      suggestedIntakeOz += 10;
    }

    return {
      hydrationMessage: llmOutput.hydrationMessage,
      suggestedIntakeOz: Math.round(suggestedIntakeOz),
    };
  }
);

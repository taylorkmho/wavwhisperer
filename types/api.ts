import { z } from "zod";

import { EquipmentType, FocusArea, Intensity } from "./domain";

// Form schema
export const workoutFormSchema = z.object({
  equipment: z.enum([
    EquipmentType.FULL_GYM,
    EquipmentType.KETTLEBELLS,
    EquipmentType.NONE,
  ]),
  focusArea: z.enum([
    FocusArea.PUSH,
    FocusArea.PULL,
    FocusArea.LEGS,
    FocusArea.CORE_SHOULDERS,
  ]),
  intensity: z.enum([Intensity.HEAVY, Intensity.FUNCTIONAL]),
  checkWeather: z.boolean(),
  duration: z.number().min(15).max(90).optional(),
  location: z
    .object({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
});

// Weather schema
export const weatherSchema = z.object({
  temp: z.number(),
  feels_like: z.number(),
  precipitation: z.number(),
  is_day: z.boolean(),
  sunrise: z.string(),
  sunset: z.string(),
});

// API types
export type WorkoutFormData = z.infer<typeof workoutFormSchema>;
export type WeatherData = z.infer<typeof weatherSchema>;

import { z } from "zod";

export const workoutFormSchema = z.object({
  equipment: z.enum(["full_gym", "kettlebells", "none"]),
  focusArea: z.enum(["push", "pull", "legs", "core_shoulders"]),
  intensity: z.enum(["heavy", "functional"]),
  checkWeather: z.boolean(),
  duration: z.number().min(15).max(90).optional(),
  location: z
    .object({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
});

export type WorkoutFormData = z.infer<typeof workoutFormSchema>;

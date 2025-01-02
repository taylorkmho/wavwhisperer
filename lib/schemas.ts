import { z } from "zod";

// Base schemas
export const exerciseBaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  equipment_tags: z.array(z.string()),
  muscle_tags: z.array(z.string()),
  created_at: z.string().datetime(),
});

// Form schemas
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

export const exerciseVariationSchema = z.object({
  reps: z.number(),
  weight: z.number().optional(),
  weight_unit: z.string().optional(),
});

export const warmupSchema = z.object({
  exercises: z.array(
    z.object({
      exercise_id: z.string(),
      sets: z.number(),
      reps: z.number(),
    })
  ),
});

export const mainSchema = z.object({
  primary: z.object({
    exercise_id: z.string(),
    sets: z.number(),
    variations: z.array(exerciseVariationSchema),
  }),
  secondary: z
    .array(
      z.object({
        exercise_id: z.string(),
        sets: z.number(),
        variations: z.array(exerciseVariationSchema),
      })
    )
    .optional(),
});

export const finisherSchema = z.object({
  exercise_id: z.string(),
  type: z.string(),
  duration_minutes: z.number(),
});

export const routineSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  structure: z.object({
    warmup: warmupSchema,
    main: mainSchema,
    finisher: finisherSchema,
  }),
  total_duration_range: z.array(z.number()),
  created_at: z.string().datetime(),
});

// Export types
export type Exercise = z.infer<typeof exerciseBaseSchema>;
export type WorkoutFormData = z.infer<typeof workoutFormSchema>;
export type Warmup = z.infer<typeof warmupSchema>;
export type Main = z.infer<typeof mainSchema>;
export type Finisher = z.infer<typeof finisherSchema>;
export type Routine = z.infer<typeof routineSchema>;

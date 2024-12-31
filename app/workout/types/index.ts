import { z } from "zod";

// Shared enums for consistent usage across the feature
export const EquipmentType = {
  FULL_GYM: "full_gym",
  KETTLEBELLS: "kettlebells",
  NONE: "none",
} as const;

export const FocusArea = {
  PUSH: "push",
  PULL: "pull",
  LEGS: "legs",
  CORE_SHOULDERS: "core_shoulders",
} as const;

export const Intensity = {
  HEAVY: "heavy",
  FUNCTIONAL: "functional",
} as const;

export const FinisherType = {
  LADDER: "ladder",
  BURNOUT: "burnout",
  DROPSET: "dropset",
  EMOM: "emom",
} as const;

// Base schemas that will be reused
export const weightSchema = z.object({
  weight: z.number(),
  weight_unit: z.enum(["kg", "lbs"]),
});

export const exerciseVariationSchema = z.object({
  exercise_id: z.string(),
  reps: z.number(),
  weight: z.number().optional(),
  weight_unit: z.enum(["kg", "lbs"]).optional(),
  notes: z.string().optional(),
});

// Derive types from the schemas
export type Weight = z.infer<typeof weightSchema>;
export type ExerciseVariation = z.infer<typeof exerciseVariationSchema>;

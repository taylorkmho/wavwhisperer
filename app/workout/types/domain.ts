import { z } from "zod";

// Shared enums
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

// Base schemas
export const weightSchema = z.object({
  weight: z.number(),
  weight_unit: z.enum(["kg", "lbs"]),
});

export const exerciseVariationSchema = z.object({
  exercise_id: z.string().uuid(),
  reps: z.number(),
  weight: z.number().optional(),
  weight_unit: z.enum(["kg", "lbs"]).optional(),
  notes: z.string().optional(),
});

export const exerciseBaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  equipment_tags: z.array(z.string()),
  muscle_tags: z.array(z.string()),
  created_at: z.string().datetime(),
});

// Domain types
export type Exercise = z.infer<typeof exerciseBaseSchema>;
export type Weight = z.infer<typeof weightSchema>;
export type Variation = z.infer<typeof exerciseVariationSchema>;

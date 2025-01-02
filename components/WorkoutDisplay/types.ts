import { z } from "zod";

import {
  FinisherType,
  exerciseVariationSchema,
  weightSchema,
} from "../../types";

export const workoutDisplaySchema = z.object({
  structure: z.object({
    warmup: z.object({
      exercises: z.array(
        z.object({
          exercise_id: z.string(),
          sets: z.number(),
          reps: z.number(),
          difficulty: z.enum(["light", "moderate", "heavy"]),
        })
      ),
    }),
    main: z.object({
      primary: z.object({
        exercise_id: z.string(),
        type: z.enum(["single", "superset"]),
        sets: z.number(),
        variations: z.array(exerciseVariationSchema),
      }),
      secondary: z.array(
        z.object({
          exercise_id: z.string(),
          type: z.enum(["single", "superset"]),
          sets: z.number(),
          variations: z.array(exerciseVariationSchema),
        })
      ),
      rest_seconds: z.number(),
    }),
    finisher: z.object({
      type: z.enum([
        FinisherType.LADDER,
        FinisherType.BURNOUT,
        FinisherType.DROPSET,
        FinisherType.EMOM,
      ]),
      duration_minutes: z.number(),
      exercise_id: z.string(),
      details: z.object({
        initial_reps: z.number().optional(),
        increment: z.number().optional(),
        target_reps: z.number().optional(),
        weights: z.array(weightSchema).optional(),
        rounds: z.number().optional(),
      }),
    }),
  }),
  total_duration_range: z.object({
    min_minutes: z.number(),
    max_minutes: z.number(),
  }),
});

export type WorkoutDisplay = z.infer<typeof workoutDisplaySchema>;

// app/workout/lib/supabase/types.ts
import { z } from "zod";

export const dbExerciseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  equipment_tags: z.array(z.string()),
  muscle_tags: z.array(z.string()),
  created_at: z.string().datetime(),
  user_id: z.string().uuid(), // References auth.users
});

export const dbRoutineSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  structure: z.object({
    warmup: z.object({
      exercises: z.array(
        z.object({
          exercise_id: z.string().uuid(),
          sets: z.number(),
          reps: z.number(),
          difficulty: z.enum(["light", "moderate", "heavy"]),
        })
      ),
    }),
    main: z.object({
      primary: z.object({
        exercise_id: z.string().uuid(),
        type: z.enum(["single", "superset"]),
        sets: z.number(),
        variations: z.array(
          z.object({
            exercise_id: z.string().uuid(),
            reps: z.number(),
            weight: z.number().optional(),
            weight_unit: z.enum(["kg", "lbs"]).optional(),
            notes: z.string().optional(),
          })
        ),
      }),
      secondary: z.array(
        z.object({
          exercise_id: z.string().uuid(),
          type: z.enum(["single", "superset"]),
          sets: z.number(),
          variations: z.array(
            z.object({
              exercise_id: z.string().uuid(),
              reps: z.number(),
              weight: z.number().optional(),
              weight_unit: z.enum(["kg", "lbs"]).optional(),
              notes: z.string().optional(),
            })
          ),
        })
      ),
      rest_seconds: z.number(),
    }),
    finisher: z.object({
      type: z.enum(["ladder", "burnout", "dropset", "emom"]),
      duration_minutes: z.number(),
      exercise_id: z.string().uuid(),
      details: z.object({
        initial_reps: z.number().optional(),
        increment: z.number().optional(),
        target_reps: z.number().optional(),
        weights: z
          .array(
            z.object({
              weight: z.number(),
              weight_unit: z.enum(["kg", "lbs"]),
            })
          )
          .optional(),
        rounds: z.number().optional(),
      }),
    }),
  }),
  total_duration_range: z.object({
    min_minutes: z.number(),
    max_minutes: z.number(),
  }),
  created_at: z.string().datetime(),
  user_id: z.string().uuid(), // References auth.users
});

export const dbWorkoutLogSchema = z.object({
  id: z.string().uuid(),
  routine_id: z.string().uuid(),
  completed_at: z.string().datetime(),
  user_id: z.string().uuid(),
  weather_data: z
    .object({
      temp: z.number(),
      conditions: z.string(),
    })
    .optional(),
  notes: z.string().optional(),
});

// Infer TypeScript types from Zod schemas
export type DbExercise = z.infer<typeof dbExerciseSchema>;
export type DbRoutine = z.infer<typeof dbRoutineSchema>;
export type DbWorkoutLog = z.infer<typeof dbWorkoutLogSchema>;

// Define Database interface for Supabase client
export interface Database {
  public: {
    Tables: {
      exercises: {
        Row: DbExercise;
        Insert: Omit<DbExercise, "id" | "created_at">;
        Update: Partial<Omit<DbExercise, "id" | "created_at">>;
      };
      routines: {
        Row: DbRoutine;
        Insert: Omit<DbRoutine, "id" | "created_at">;
        Update: Partial<Omit<DbRoutine, "id" | "created_at">>;
      };
      workout_logs: {
        Row: DbWorkoutLog;
        Insert: Omit<DbWorkoutLog, "id">;
        Update: Partial<Omit<DbWorkoutLog, "id">>;
      };
    };
  };
}

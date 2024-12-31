/**
 * File: app/workout/types/database.ts
 * Database schemas and types for the workout feature
 */

import { z } from "zod";

import { exerciseBaseSchema, routineSchema } from "../lib/schemas";

// Database schemas
export const dbExerciseSchema = exerciseBaseSchema.extend({
  user_id: z.string().uuid(),
});

export const dbRoutineSchema = routineSchema.extend({
  user_id: z.string().uuid(),
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

// Database types
export type DbExercise = z.infer<typeof dbExerciseSchema>;
export type DbRoutine = z.infer<typeof dbRoutineSchema>;
export type DbWorkoutLog = z.infer<typeof dbWorkoutLogSchema>;

// Supabase interface
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

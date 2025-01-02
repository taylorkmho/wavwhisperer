import { type DbExercise, type DbRoutine } from "../types/database";
import {
  exerciseBaseSchema,
  finisherSchema,
  mainSchema,
  routineSchema,
  warmupSchema,
  type Exercise,
  type Finisher,
  type Main,
  type Routine,
  type Warmup,
} from "./schemas";

/**
 * Transform database exercise to domain exercise
 */
export const transformDbExercise = (dbExercise: DbExercise): Exercise => {
  return exerciseBaseSchema.parse({
    id: dbExercise.id,
    name: dbExercise.name,
    description: dbExercise.description,
    equipment_tags: dbExercise.equipment_tags,
    muscle_tags: dbExercise.muscle_tags,
    created_at: dbExercise.created_at,
  });
};

/**
 * Transform database warmup to domain warmup
 */
export const transformWarmup = (
  dbWarmup: DbRoutine["structure"]["warmup"]
): Warmup => {
  return warmupSchema.parse(dbWarmup);
};

/**
 * Transform database main workout to domain main workout
 */
export const transformMain = (dbMain: DbRoutine["structure"]["main"]): Main => {
  return mainSchema.parse(dbMain);
};

/**
 * Transform database finisher to domain finisher
 */
export const transformFinisher = (
  dbFinisher: DbRoutine["structure"]["finisher"]
): Finisher => {
  return finisherSchema.parse(dbFinisher);
};

/**
 * Transform complete database routine to domain routine
 */
export const transformDbRoutine = (dbRoutine: DbRoutine): Routine => {
  return routineSchema.parse({
    id: dbRoutine.id,
    name: dbRoutine.name,
    structure: {
      warmup: transformWarmup(dbRoutine.structure.warmup),
      main: transformMain(dbRoutine.structure.main),
      finisher: transformFinisher(dbRoutine.structure.finisher),
    },
    total_duration_range: dbRoutine.total_duration_range,
    created_at: dbRoutine.created_at,
  });
};

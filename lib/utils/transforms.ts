import { Exercise, Routine } from "@/lib/schemas";
import {
  transformFinisher,
  transformMain,
  transformWarmup,
} from "@/lib/transforms";
import { DbExercise, DbRoutine } from "@/app/workout/lib/types";

export const transformDbExercise = (dbExercise: DbExercise): Exercise => ({
  id: dbExercise.id,
  name: dbExercise.name,
  description: dbExercise.description,
  equipment_tags: dbExercise.equipment_tags,
  muscle_tags: dbExercise.muscle_tags,
  created_at: dbExercise.created_at,
});

export const transformDbRoutine = (dbRoutine: DbRoutine): Routine => ({
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

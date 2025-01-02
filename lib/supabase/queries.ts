import { type Routine } from "@/lib/schemas";

import { supabase } from "./client";

export const getExercisesByTags = async (
  equipmentTags: string[],
  muscleTags: string[]
) => {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .contains("equipment_tags", equipmentTags)
    .contains("muscle_tags", muscleTags);

  if (error) throw error;
  return data;
};

export const createRoutine = async (routine: Routine) => {
  const { data, error } = await supabase
    .from("routines")
    .insert(routine)
    .select()
    .single();

  if (error) throw error;
  return data;
};

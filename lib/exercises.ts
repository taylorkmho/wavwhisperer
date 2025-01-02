import { supabase } from "@/lib/supabase/client";

import { EquipmentType, FocusArea, type Exercise } from "../types/domain";

const muscleTagMap = {
  push: ["chest", "triceps", "shoulders"],
  pull: ["back", "biceps"],
  legs: ["quadriceps", "hamstrings", "calves"],
  core_shoulders: ["core", "shoulders"],
} as const;

const equipmentTagMap = {
  [EquipmentType.FULL_GYM]: ["barbell", "dumbbell", "cable", "machine"],
  [EquipmentType.KETTLEBELLS]: ["kettlebell"],
  [EquipmentType.NONE]: ["bodyweight"],
};

export async function getExercisesForWorkout(
  focusArea: keyof typeof FocusArea,
  equipment: keyof typeof EquipmentType
): Promise<Exercise[]> {
  const muscleTags =
    muscleTagMap[focusArea.toLowerCase() as keyof typeof muscleTagMap];
  const equipmentTags =
    equipmentTagMap[equipment.toLowerCase() as keyof typeof equipmentTagMap];

  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .contains("muscle_tags", muscleTags)
    .contains("equipment_tags", equipmentTags);

  if (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }

  return data;
}

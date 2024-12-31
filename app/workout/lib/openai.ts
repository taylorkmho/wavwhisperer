import { EquipmentType, FocusArea, Intensity } from "../types/domain";
import { type WorkoutFormData } from "./schemas";

export function generateWorkoutPrompt(data: WorkoutFormData): string {
  const equipmentMap = {
    [EquipmentType.FULL_GYM]: "full gym with all standard equipment",
    [EquipmentType.KETTLEBELLS]: "kettlebells only",
    [EquipmentType.NONE]: "bodyweight exercises only",
  };

  const focusMap = {
    [FocusArea.PUSH]: "pushing movements (chest, triceps, shoulders)",
    [FocusArea.PULL]: "pulling movements (back, biceps)",
    [FocusArea.LEGS]: "lower body",
    [FocusArea.CORE_SHOULDERS]: "core and shoulders",
  };

  const intensityMap = {
    [Intensity.HEAVY]: "heavy weight, lower reps (4-8 reps)",
    [Intensity.FUNCTIONAL]: "moderate weight, higher reps (10-15 reps)",
  };

  return `Create a ${data.duration}-minute workout routine with:
- Equipment: ${equipmentMap[data.equipment]}
- Focus: ${focusMap[data.focusArea]}
- Intensity: ${intensityMap[data.intensity]}

The workout should include:
1. A proper warm-up sequence
2. A main workout section with primary and secondary exercises
3. A challenging finisher

Ensure the exercises are appropriate for the available equipment and intensity level.`;
}

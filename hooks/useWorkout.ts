import { create } from "zustand";

import {
  workoutFormSchema,
  type Routine,
  type WorkoutFormData,
} from "../lib/schemas";

interface WorkoutStore {
  currentWorkout: Routine | null;
  isGenerating: boolean;
  generateWorkout: (data: WorkoutFormData) => Promise<void>;
}

export const useWorkout = create<WorkoutStore>((set) => ({
  currentWorkout: null,
  isGenerating: false,
  generateWorkout: async (data) => {
    set({ isGenerating: true });
    try {
      const response = await fetch("/api/workout/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate workout");
      }

      const workout = await response.json();
      set({ currentWorkout: workout });
    } catch (error) {
      console.error("Error generating workout:", error);
      throw error;
    } finally {
      set({ isGenerating: false });
    }
  },
}));

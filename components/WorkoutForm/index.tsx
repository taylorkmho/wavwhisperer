"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useWorkout } from "../../hooks/useWorkout";
import { workoutFormSchema, type WorkoutFormData } from "../../lib/schemas";
import { EquipmentType, FocusArea, Intensity } from "../../types/domain";

export default function WorkoutForm() {
  const { generateWorkout, isGenerating } = useWorkout();

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      equipment: EquipmentType.FULL_GYM,
      focusArea: FocusArea.PUSH,
      intensity: Intensity.HEAVY,
      checkWeather: false,
      duration: 45,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(generateWorkout)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="equipment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EquipmentType.FULL_GYM}>
                      Full Gym
                    </SelectItem>
                    <SelectItem value={EquipmentType.KETTLEBELLS}>
                      Kettlebells
                    </SelectItem>
                    <SelectItem value={EquipmentType.NONE}>
                      Bodyweight
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Similar FormFields for focusArea and intensity */}

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={15}
                    max={90}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Workout"}
        </Button>
      </form>
    </Form>
  );
}

"use client";

import { motion } from "framer-motion";
import { Dumbbell, Timer } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

import { useWorkout } from "../../hooks/useWorkout";

export default function WorkoutDisplay() {
  const { currentWorkout } = useWorkout();

  if (!currentWorkout) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{currentWorkout.name}</h2>
          <div className="flex items-center text-muted-foreground">
            <Timer className="mr-1 size-4" />
            <span>
              {currentWorkout.total_duration_range[0]}-
              {currentWorkout.total_duration_range[1]} min
            </span>
          </div>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="warmup">
            <AccordionTrigger className="text-lg font-semibold">
              Warm Up
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {currentWorkout.structure.warmup.exercises.map(
                  (exercise, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-muted p-3"
                    >
                      <div className="flex items-center">
                        <Dumbbell className="mr-2 size-4" />
                        <span>{exercise.exercise_id}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {exercise.sets} × {exercise.reps}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="main">
            <AccordionTrigger className="text-lg font-semibold">
              Main Workout
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Primary Exercise</h4>
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center justify-between">
                    <span>
                      {currentWorkout.structure.main.primary.exercise_id}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {currentWorkout.structure.main.primary.sets} sets
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {currentWorkout.structure.main.primary.variations.map(
                      (variation, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {variation.reps} reps
                          {variation.weight &&
                            ` @ ${variation.weight}${variation.weight_unit}`}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Secondary Exercises</h4>
                <div className="space-y-2">
                  {currentWorkout.structure.main.secondary?.map(
                    (exercise, i) => (
                      <div key={i} className="rounded-lg bg-muted p-3">
                        <div className="flex items-center justify-between">
                          <span>{exercise.exercise_id}</span>
                          <span className="text-sm text-muted-foreground">
                            {exercise.sets} sets
                          </span>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {exercise.variations.map((variation, j) => (
                            <li
                              key={j}
                              className="text-sm text-muted-foreground"
                            >
                              {variation.reps} reps
                              {variation.weight &&
                                ` @ ${variation.weight}${variation.weight_unit}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="finisher">
            <AccordionTrigger className="text-lg font-semibold">
              Finisher
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center justify-between">
                  <span>{currentWorkout.structure.finisher.exercise_id}</span>
                  <span className="text-sm text-muted-foreground">
                    {currentWorkout.structure.finisher.duration_minutes} min
                  </span>
                </div>
                <p className="mt-1 text-sm capitalize text-muted-foreground">
                  Type: {currentWorkout.structure.finisher.type}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </motion.div>
  );
}

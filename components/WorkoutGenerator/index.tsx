"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CloudSun, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useWorkout } from "../../hooks/useWorkout";
import WeatherCard from "../WeatherCheck/WeatherCard";
import WorkoutDisplay from "../WorkoutDisplay";
import WorkoutForm from "../WorkoutForm";

export default function WorkoutGenerator() {
  const { isGenerating } = useWorkout();
  const [showWeather, setShowWeather] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Generate Your Workout</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowWeather(!showWeather)}
        >
          <CloudSun className="mr-2 h-4 w-4" />
          Check Weather
        </Button>
      </div>

      <AnimatePresence>
        {showWeather && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <WeatherCard />
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="p-6">
        <WorkoutForm />
      </Card>

      {isGenerating && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      <AnimatePresence mode="wait">
        <WorkoutDisplay />
      </AnimatePresence>

      <Separator className="my-8" />

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Powered by OpenAI GPT-4. Workouts are generated based on your
          preferences and equipment availability.
        </p>
      </div>
    </div>
  );
}

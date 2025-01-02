import { WeatherData } from "@/types/api";

export const openAIFunctions = [
  {
    name: "generateWorkout",
    description:
      "Generate a personalized workout routine based on available equipment and preferences",
    parameters: {
      type: "object",
      properties: {
        equipment: {
          type: "string",
          enum: ["full_gym", "kettlebells", "bodyweight"],
          description:
            "Available equipment - bodyweight will generate simpler, outdoor-friendly routines",
        },
        focusArea: {
          type: "string",
          enum: ["push", "pull", "legs", "core_shoulders"],
          description: "Primary muscle group focus",
        },
        intensity: {
          type: "string",
          enum: ["heavy", "functional"],
          description:
            "Desired workout intensity - functional better suits outdoor workouts",
        },
        duration: {
          type: "number",
          description: "Target workout duration in minutes",
          minimum: 15,
          maximum: 90,
        },
      },
      required: ["equipment", "focusArea", "intensity"],
    },
  },
];

export const generateWeatherResponse = async (params: {
  sfWeather: WeatherData;
  kailuaWeather: WeatherData;
}): Promise<string> => {
  const response = await fetch("/api/workout/weather-gen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to generate weather response");
  }

  const data = await response.json();
  return data.response;
};

import { WeatherData } from "@/types/api";

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

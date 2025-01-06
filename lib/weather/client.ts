import { WeatherData } from "@/types/api";

export const fetchWeather = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error(
      `Weather API error: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

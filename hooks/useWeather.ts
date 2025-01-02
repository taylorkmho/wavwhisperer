"use client";

import { useQuery } from "@tanstack/react-query";

import { WeatherData, weatherSchema } from "../types/api";

async function fetchWeather(lat?: number, lon?: number): Promise<WeatherData> {
  if (!lat || !lon) {
    throw new Error("Location coordinates required");
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new Error(
      "Invalid coordinates: Latitude must be between -90 and 90, Longitude between -180 and 180"
    );
  }

  const response = await fetch(`/api/workout/weather?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Weather API Error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(`Failed to fetch weather: ${response.statusText}`);
  }

  const data = await response.json();
  try {
    const parsed = weatherSchema.parse(data);
    return parsed;
  } catch (error) {
    console.error("Weather data validation error:", {
      receivedData: data,
      error,
    });
    throw new Error("Invalid weather data received from API");
  }
}

export function useWeather(lat?: number, lon?: number) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat, lon),
    enabled: Boolean(lat && lon),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

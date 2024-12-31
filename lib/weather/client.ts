import { WeatherData } from "@/app/workout/types/api";

export const fetchWeather = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,is_day&timezone=auto&temperature_unit=fahrenheit&precipitation_unit=inch&daily=sunrise,sunset`;
    console.log("Fetching from URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Weather API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(
        `Weather API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Weather API response:", data);

    return {
      temp: Math.round(data.current.temperature_2m),
      feels_like: Math.round(data.current.apparent_temperature),
      precipitation: data.current.precipitation,
      is_day: data.current.is_day === 1,
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
    };
  } catch (error) {
    console.error("Error in fetchWeather:", error);
    throw error;
  }
};

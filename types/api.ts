import { z } from "zod";

// Weather schema
export const weatherSchema = z.object({
  temp: z.number(),
  feels_like: z.number(),
  precipitation: z.number(),
  is_day: z.boolean(),
  sunrise: z.string(),
  sunset: z.string(),
});

// Weather types
export type WeatherData = z.infer<typeof weatherSchema>;

// Location type (used by WeatherCard)
export interface Location {
  name: string;
  subtitle?: string;
}

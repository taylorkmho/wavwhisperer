import { z } from "zod";

export const weatherSchema = z.object({
  temp: z.number(),
  feels_like: z.number(),
  conditions: z.string(),
  icon: z.string(),
  location: z.object({
    city: z.string(),
    country: z.string(),
  }),
});

export type WeatherData = z.infer<typeof weatherSchema>;

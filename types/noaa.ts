import { z } from "zod";

// Wave Height Schema
export const waveHeightSchema = z.object({
  direction: z.string(),
  height: z.string(),
  minHeight: z.number(),
  maxHeight: z.number(),
  trend: z.enum(["increasing", "decreasing", "steady"]),
  order: z.number(),
});

// General Day Info Schema
export const generalDayInfoSchema = z.object({
  day: z.string(),
  weather: z.string(),
  temperature: z.string(),
  winds: z.string(),
  sunrise: z.string(),
  sunset: z.string(),
});

// Surf Report Schema
export const surfReportSchema = z.object({
  lastBuildDate: z.string(),
  lastBuildDateObject: z.date(),
  discussion: z.array(z.string()),
  waveHeights: z.array(waveHeightSchema),
  generalDayInfo: z.array(generalDayInfoSchema),
});

// Types inferred from schemas
export type WaveHeight = z.infer<typeof waveHeightSchema>;
export type GeneralDayInfo = z.infer<typeof generalDayInfoSchema>;
export type SurfReport = z.infer<typeof surfReportSchema>;

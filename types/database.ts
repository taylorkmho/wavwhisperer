import { z } from "zod";
import { waveHeightSchema } from "./noaa";

export const surfReportRecordSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().transform((val) => new Date(val).toISOString()),
  last_build_date: z.string(),
  discussion: z.array(z.string()),
  wave_heights: z.array(waveHeightSchema),
  raw_xml: z.string(),
});

export const generationRecordSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().transform((val) => new Date(val).toISOString()),
  surf_report_id: z.string().uuid(),
  poem: z.array(z.string()),
  model: z.string(),
});

export type SurfReportRecord = z.infer<typeof surfReportRecordSchema>;
export type GenerationRecord = z.infer<typeof generationRecordSchema>;

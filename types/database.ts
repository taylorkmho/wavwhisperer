import { z } from "zod";
import { waveHeightSchema } from "./noaa";

export const surfReportRecordSchema = z.object({
  id: z.string().uuid(),
  created_at: z
    .string()
    .transform((val) => new Date(val).toISOString())
    .optional(),
  last_build_date: z.string(),
  discussion: z.array(z.string()),
  wave_heights: z.array(waveHeightSchema),
  raw_xml: z.string().optional(),
  poem: z.array(z.string()),
  model: z.string(),
  audio_path: z.string().nullable().optional(),
});

export type SurfReportRecord = z.infer<typeof surfReportRecordSchema>;

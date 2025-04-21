import { SurfReportClientService } from "@/lib/services/surf-report.client";
import { surfReportSchema, type SurfReport } from "@/types/noaa";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useSurfReport(id?: string): UseQueryResult<SurfReport> {
  return useQuery<SurfReport>({
    queryKey: id ? ["surf-report", id] : ["surf-report"],
    queryFn: async () => {
      const report = await SurfReportClientService.getReport(id);
      if (!report) {
        throw new Error(
          id
            ? `No surf report available for id ${id}`
            : "No surf report available"
        );
      }

      return surfReportSchema.parse({
        lastBuildDate: report.last_build_date,
        lastBuildDateObject: new Date(report.last_build_date),
        discussion: report.discussion,
        waveHeights: report.wave_heights,
        poem: report.poem,
        model: report.model,
        audioPath: report.audio_path ?? undefined,
      });
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { SurfReportClientService } from "@/lib/services/surf-report.client";
import { surfReportSchema, type SurfReport } from "@/types/noaa";

export function useNoaaSurfReport() {
  return useQuery<SurfReport>({
    queryKey: ["surf-report"],
    queryFn: async () => {
      const report = await SurfReportClientService.getLatestReport();
      if (!report) {
        throw new Error("No surf report available");
      }

      return surfReportSchema.parse({
        id: report.id,
        lastBuildDate: report.last_build_date,
        lastBuildDateObject: new Date(report.last_build_date),
        discussion: report.discussion,
        waveHeights: report.wave_heights,
      });
    },
  });
}

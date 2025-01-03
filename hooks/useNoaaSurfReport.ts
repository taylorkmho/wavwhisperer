import { useQuery } from "@tanstack/react-query";
import { SurfReport } from "@/types/noaa";

export function useNoaaSurfReport(island: string) {
  return useQuery<SurfReport>({
    queryKey: ["surf-report", island],
    queryFn: async () => {
      const response = await fetch(`/api/surf?island=${island}`);
      if (!response.ok) {
        throw new Error("Failed to fetch surf report");
      }
      return response.json();
    },
  });
}

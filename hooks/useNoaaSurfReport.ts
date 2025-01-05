import { useQuery } from "@tanstack/react-query";
import { SurfReport } from "@/types/noaa";

export function useNoaaSurfReport() {
  return useQuery<SurfReport>({
    queryKey: ["surf-report"],
    queryFn: async () => {
      const response = await fetch(`/api/surf`);
      if (!response.ok) {
        throw new Error("Failed to fetch surf report");
      }
      return response.json();
    },
  });
}

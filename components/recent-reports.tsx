import { SurfReportClientService } from "@/lib/services/surf-report.client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiVolumeOff } from "react-icons/hi";
import { WaveHeights } from "./SurfReport/BottomNav/WaveHeights";

export function RecentReports() {
  const pathname = usePathname();
  const { data: reports, isLoading } = useQuery({
    queryKey: ["recent-reports"],
    queryFn: () => SurfReportClientService.getRecentReports(20),
  });

  if (isLoading) {
    return <div className="text-white">Loading recent reports...</div>;
  }

  if (!reports || reports.length === 0) {
    return <div className="text-white">No recent reports found.</div>;
  }

  const isActive = (reportId: string) => {
    return pathname === `/report/${reportId}`;
  };

  return (
    <div className="flex flex-col">
      {reports.map((report) => (
        <Link
          key={report.id}
          href={`/report/${report.id}`}
          className={cn(
            "relative flex flex-col items-center gap-1 rounded p-2 text-center hover:bg-muted/50",
            isActive(report.id) &&
              "hover:bg-brand/20 bg-brand/20 hover:cursor-default"
          )}
        >
          <p
            className={cn(
              "relative rounded-md px-1.5 text-base font-bold tracking-wider",
              isActive(report.id) &&
                "from-brand/20 to-brand/70 inline-flex bg-gradient-to-br text-white"
            )}
          >
            {new Date(report.last_build_date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "numeric",
              day: "numeric",
            })}
            {report.audio_path ? null : (
              <span className="absolute inset-y-0 right-0 inline-flex translate-x-full items-center">
                <span
                  className={cn(
                    "flex rounded bg-rose-600/20 px-0.5 text-rose-600/80",
                    isActive(report.id) && "translate-x-1 bg-white/0 text-white"
                  )}
                >
                  <HiVolumeOff className="size-4" />
                  <span className="sr-only">No Audio</span>
                </span>
              </span>
            )}
          </p>
          <WaveHeights variant="display" waveHeights={report.wave_heights} />
        </Link>
      ))}
    </div>
  );
}

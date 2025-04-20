import { SurfReportClientService } from "@/lib/services/surf-report.client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function RecentReports() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["recent-reports"],
    queryFn: () => SurfReportClientService.getRecentReports(5),
  });

  if (isLoading) {
    return <div className="text-white">Loading recent reports...</div>;
  }

  if (!reports || reports.length === 0) {
    return <div className="text-white">No recent reports found.</div>;
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Link
          key={report.id}
          href={`/report/${report.id}`}
          className="border-brand/20 rounded-lg border bg-black p-4 text-white"
        >
          <div className="text-sm font-bold">
            {new Date(report.last_build_date).toLocaleDateString()}
          </div>
          <div className="mt-2 text-sm">{report.poem}</div>
        </Link>
      ))}
    </div>
  );
}

import { useCurrentReport } from "./SurfReport/CurrentReportContext";

export function CurrentReportDisplay() {
  const { currentReport } = useCurrentReport();

  if (!currentReport) {
    return null;
  }

  const date =
    "lastBuildDate" in currentReport
      ? currentReport.lastBuildDate
      : currentReport.last_build_date;

  return (
    <div className="mt-4 text-sm text-white">
      <div className="font-bold">{date}</div>
      <div className="mt-2">{currentReport.discussion[0]}</div>
    </div>
  );
}

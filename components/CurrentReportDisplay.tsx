import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { useCurrentReport } from "./SurfReport/CurrentReportContext";

export function CurrentReportDisplay({
  onShowRecentReports,
}: {
  onShowRecentReports: () => void;
}) {
  const { currentReport } = useCurrentReport();

  const date = currentReport
    ? "lastBuildDate" in currentReport
      ? currentReport.lastBuildDate
      : currentReport.last_build_date
    : null;

  const isToday = useMemo(() => {
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate.getTime() === today.getTime();
  }, [date]);

  if (!currentReport) {
    return <div />;
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <button
        className="border-brand/0 hover:bg-brand/25 hover:border-brand/80 group pointer-events-auto flex size-8 shrink-0 items-center justify-center rounded-full border-2 bg-black p-1.5"
        onClick={onShowRecentReports}
        title="Recent Surf Reports"
        aria-label="Recent Surf Reports"
      >
        <FaArrowUp className="size-full group-hover:scale-105 group-active:scale-95" />
        <span className="sr-only">Recent Surf Reports</span>
      </button>
      <motion.div
        className="relative text-sm text-foreground"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 1 }}
      >
        <div className="flex items-center justify-center gap-3 rounded-lg bg-background px-4 font-pixel text-3xl font-normal">
          {isToday && <span className="text-brand text-[0.7em]">TODAY</span>}
          {new Date(date!).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div
          className={cn(
            "absolute inset-0 -z-10 rounded-full bg-[length:200%_100%] blur-lg",
            "animate-shimmer via-brand from-brand/0 to-brand/0 bg-gradient-to-r from-10% via-30% to-90%"
          )}
        />
      </motion.div>
    </div>
  );
}

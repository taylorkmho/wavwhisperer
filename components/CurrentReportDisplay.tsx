import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { useAudio } from "./SurfReport/AudioContext";
import { useCurrentReport } from "./SurfReport/CurrentReportContext";

export function CurrentReportDisplay({
  onShowRecentReports,
}: {
  onShowRecentReports: () => void;
}) {
  const { currentReport } = useCurrentReport();
  const { isPlaying, play, pause, audioRef, progress } = useAudio();

  const date = currentReport
    ? "lastBuildDate" in currentReport
      ? currentReport.lastBuildDate
      : currentReport.last_build_date
    : null;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === " " || event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isPlaying) {
          pause();
        } else {
          play();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, play, pause]);

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
      {audioRef !== null && (
        <button
          className="group pointer-events-auto flex size-8"
          onClick={() => (isPlaying ? pause() : play())}
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <div className="size-full group-hover:scale-105 group-active:scale-95">
            {isPlaying ? (
              <IoMdPause className="size-full" />
            ) : (
              <IoMdPlay className="size-full" />
            )}
          </div>
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </button>
      )}
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
          <div
            className={cn("absolute inset-x-0 -bottom-2 h-0.5 w-full bg-white")}
            style={{
              transform: `scaleX(${progress})`,
            }}
          />
        </div>
        <div
          className={cn(
            "absolute inset-0 -z-10 rounded-full bg-[length:200%_100%] blur-lg",
            "animate-shimmer via-brand from-brand/0 to-brand/0 bg-gradient-to-r from-10% via-30% to-90%"
          )}
        />
      </motion.div>
      <motion.button
        className="pointer-events-auto relative text-sm text-foreground"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 1.3 }}
        onClick={onShowRecentReports}
      >
        <div className="flex items-center justify-center gap-3 rounded-lg bg-background px-4 font-pixel text-3xl font-normal">
          <span className="text-[0.7em]">RECENT</span>
        </div>
      </motion.button>
    </div>
  );
}

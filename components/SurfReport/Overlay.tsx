import AnimatedPuns from "@/components/AnimatedPuns";
import { CurrentReportDisplay } from "@/components/CurrentReportDisplay";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAudio } from "./AudioContext";
import { BottomNav } from "./BottomNav";
import { useCurrentReport } from "./CurrentReportContext";

export function Overlay() {
  const { currentReport } = useCurrentReport();
  const { isPlaying, play, pause, audioRef } = useAudio();
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex w-full flex-col gap-4 border-2 border-red-400 px-4 md:flex-row">
      <div className="order-2 flex justify-between gap-2 lg:flex-row">
        <div className="flex flex-row-reverse items-start gap-2 px-2 md:flex-row md:px-0 md:text-right">
          <AnimatedPuns />
          <Link
            href="https://tellaho.com/?utm_source=wavewhisperer"
            target="_blank"
            className="border-brand/20 hover:bg-brand pointer-events-auto flex shrink-0 items-center border bg-black px-2 py-2.5 text-sm font-bold text-white transition-colors"
          >
            /th
          </Link>
        </div>
      </div>
      <div className="order-2 flex grow flex-col gap-4 border-2 border-blue-400 md:order-1">
        <h1 className="max-w-96 text-6xl font-normal lg:max-w-xl lg:text-8xl">
          Peer into the crystal ball
        </h1>
        <CurrentReportDisplay />
        {audioRef !== null && (
          <motion.button
            className={cn(
              "group pointer-events-auto inline-flex h-8 w-24 items-center justify-center px-2 font-pixel text-3xl"
            )}
            initial={{ opacity: 0, scale: 1.2, filter: "blur(2px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              duration: 0.8,
              damping: 10,
              delay: 0.2,
            }}
            onClick={() => (isPlaying ? pause() : play())}
          >
            <span
              className={cn(
                "bg-brand w-full rounded-sm transition-transform hover:scale-[103%] active:scale-[95%]",
                isPlaying &&
                  "text-brand scale-95 bg-white hover:scale-95 active:scale-[90%]"
              )}
            >
              {isPlaying ? "PAUSE" : "PLAY"}
            </span>
          </motion.button>
        )}
      </div>
      {currentReport && <BottomNav currentSurfReport={currentReport} />}
    </div>
  );
}

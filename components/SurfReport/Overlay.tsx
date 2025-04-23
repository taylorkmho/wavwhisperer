import AnimatedPuns from "@/components/AnimatedPuns";
import { CurrentReportDisplay } from "@/components/CurrentReportDisplay";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ButtonVibes } from "../ButtonVibes";
import { useAudio } from "./AudioContext";
import { BottomNav } from "./BottomNav";
import { useCurrentReport } from "./CurrentReportContext";

export function Overlay() {
  const { currentReport } = useCurrentReport();
  const { isPlaying, play, pause, audioRef, progress } = useAudio();
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex w-full flex-col gap-4 border-0 border-red-400 p-4 md:flex-row">
      <div className="order-2 flex flex-row-reverse gap-2 self-start px-2 md:flex-row md:px-0 md:text-right">
        <AnimatedPuns />
        <Link
          href="https://tellaho.com/?utm_source=wavewhisperer"
          target="_blank"
          className="border-brand/40 hover:bg-brand pointer-events-auto flex shrink-0 items-center rounded-lg border bg-black px-2 text-sm font-bold text-white transition-colors"
        >
          /th
        </Link>
      </div>

      <div className="order-2 flex grow flex-col gap-4 border-0 border-blue-400 md:order-1">
        <h1 className="max-w-96 text-4xl font-normal md:text-6xl lg:max-w-xl lg:text-8xl">
          Peer into the
          <br /> crystal ball
        </h1>
        <CurrentReportDisplay />
      </div>

      {currentReport && (
        <div className="absolute inset-x-4 bottom-4 order-3 flex flex-row items-end gap-4 border-0 border-fuchsia-400">
          {audioRef !== null && (
            <ButtonVibes
              className={cn(
                "group pointer-events-auto inline-flex shrink-0 items-center justify-center place-self-center rounded-lg font-pixel",
                "relative h-10 w-20 text-4xl",
                "md:w-24",
                "bg-brand",
                isPlaying && "text-brand bg-white"
              )}
              isActive={isPlaying}
              onClick={() => (isPlaying ? pause() : play())}
            >
              {isPlaying ? "PAUSE" : "PLAY"}
              <div
                className={cn(
                  "absolute inset-x-0 -bottom-2 h-0.5 w-full bg-white"
                )}
                style={{
                  transform: `scaleX(${progress})`,
                }}
              />
            </ButtonVibes>
          )}
          <div
            className={cn(
              "h-10 min-w-0 grow",
              "md:absolute md:inset-x-0 md:bottom-0 md:flex md:justify-center"
            )}
          >
            <BottomNav currentSurfReport={currentReport} />
          </div>
        </div>
      )}
    </div>
  );
}

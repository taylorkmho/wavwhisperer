import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";
import { ButtonVibes } from "./ButtonVibes";
import { RecentReports } from "./recent-reports";
import { useAudio } from "./SurfReport/AudioContext";
import { useCurrentReport } from "./SurfReport/CurrentReportContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export function CurrentReportDisplay() {
  const { currentReport } = useCurrentReport();
  const { isPlaying, play, pause } = useAudio();

  const date = currentReport?.lastBuildDate ?? null;

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
    <div className="flex flex-row items-center gap-2 border-0 border-violet-400">
      <Sheet>
        <SheetTrigger asChild>
          <ButtonVibes className="pointer-events-auto relative text-sm text-foreground">
            <div className="flex items-center justify-center gap-3 rounded-lg bg-background px-4 font-pixel text-3xl font-normal">
              {isToday && (
                <span className="text-brand text-[0.7em]">TODAY</span>
              )}
              {new Date(date!).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div
              className={cn(
                "absolute inset-x-2 inset-y-0 -z-10 rounded-full bg-[length:200%_100%] blur-lg",
                "animate-shimmer via-brand from-brand/0 to-brand/0 bg-gradient-to-r from-10% via-30% to-90%",
                isPlaying &&
                  "from-fuchsia-500/0 via-fuchsia-500 to-fuchsia-500/0"
              )}
            />
          </ButtonVibes>
        </SheetTrigger>
        <SheetContent side="left" className="h-full overflow-y-auto p-0">
          <SheetHeader className="p-2">
            <button
              onClick={() => (isPlaying ? pause() : play())}
              className={cn(
                "inline-flex w-16 items-center justify-center rounded-sm bg-muted py-1 font-pixel text-2xl leading-none",
                isPlaying && "text-brand bg-white"
              )}
            >
              {isPlaying ? "PAUSE" : "PLAY"}
            </button>
            <SheetTitle className="sr-only">Recent Reports</SheetTitle>
          </SheetHeader>
          <SheetDescription>
            <RecentReports />
          </SheetDescription>
        </SheetContent>
      </Sheet>
    </div>
  );
}

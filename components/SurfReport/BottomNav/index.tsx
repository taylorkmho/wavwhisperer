import { cn } from "@/lib/utils";
import { SurfReport } from "@/types/noaa";
import { AnimatePresence, motion } from "framer-motion";
import { decode } from "html-entities";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEllipsis, FaGithub, FaPause, FaPlay } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import { useAudio } from "../AudioContext";
import { WaveHeights } from "./WaveHeights";

interface BottomNavProps {
  currentSurfReport: SurfReport;
}

const formatTimeStamp = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = String(Math.floor(timeInSeconds % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export function BottomNav({ currentSurfReport }: BottomNavProps) {
  const plausible = usePlausible();
  const { isPlaying, play, pause, audioRef } = useAudio();
  const [audioProgress, setAudioProgress] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { waveHeights, audioPath } = currentSurfReport;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!audioPath) return;
      if (event.key === " " || event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isPlaying) {
          toast("such clairvoyance");
          pause();
        } else {
          toast("so wow");
          play();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, play, pause, audioPath]);

  const handleAudioEnd = () => {
    plausible(`Audio completed (${audioPath})`);
    pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleAudioStart = () => {
    if (audioRef.current) {
      plausible(
        `Audio started${audioRef.current.currentTime >= 1 ? ` ${formatTimeStamp(audioRef.current.currentTime)}` : ""} (${audioPath})`
      );
    }
  };

  const updateAudioProgress = () => {
    if (audioRef.current) {
      const progress = audioRef.current.currentTime / audioRef.current.duration;
      setAudioProgress(progress);
    }
  };

  return (
    <nav>
      {audioPath && (
        <audio
          ref={audioRef}
          className="invisible"
          src={`https://mnegthmftttdlazyjbke.supabase.co/storage/v1/object/public/voiceover/${audioPath}`}
          onEnded={handleAudioEnd}
          onPlay={handleAudioStart}
          onTimeUpdate={updateAudioProgress}
        />
      )}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="absolute inset-x-0 bottom-4 flex flex-col items-center space-y-2 px-4"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            key="dropdown"
          >
            <div className="relative mx-auto max-w-lg overflow-hidden rounded-xl bg-black/70 font-mono text-sm font-normal text-muted-foreground backdrop-blur-lg">
              <div className="max-h-48 space-y-2 overflow-y-auto p-4">
                {currentSurfReport.discussion.map((paragraph, index) => (
                  <p key={index}>{decode(paragraph)}</p>
                ))}
              </div>
            </div>
            <div className="inline-flex items-center gap-2 overflow-hidden rounded-full bg-secondary text-xs">
              <div className="flex grow items-center gap-2 py-1 pl-1">
                <Image
                  src="/noaa_digital_logo.svg"
                  alt="NOAA"
                  width={30}
                  height={30}
                />
                <h6 className="flex min-w-0 grow flex-col gap-0.5 leading-none">
                  <span className="text-muted-foreground">
                    Report data pulled from
                  </span>{" "}
                  <Link
                    href="https://www.weather.gov/hfo/SRF"
                    className="truncate font-bold decoration-foreground/50 underline-offset-2 hover:underline"
                    target="_blank"
                  >
                    National Oceanic and Atmospheric Administration
                  </Link>
                </h6>
              </div>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="inline-flex h-full shrink-0 items-center py-2 pl-1.5 pr-2.5 text-xs hover:bg-white/5"
              >
                <IoClose className="size-5" />
              </button>
            </div>
          </motion.div>
        )}
        {!isDropdownOpen && (
          <motion.div
            className="absolute inset-x-0 bottom-4 flex justify-center px-4"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            key="bottom-nav"
          >
            <div className="relative flex min-w-0 items-center overflow-clip rounded-full bg-secondary">
              {audioPath && (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 z-50 bg-emerald-400/10 transition-transform duration-500 ease-linear"
                    style={{
                      transform: `scaleX(${audioProgress})`,
                      transformOrigin: "left",
                    }}
                  />
                  <button
                    onClick={isPlaying ? pause : play}
                    className="group h-full shrink-0 bg-black/20 pl-4 pr-0"
                  >
                    {isPlaying ? (
                      <FaPause className="size-4 transition-transform group-hover:scale-125 group-active:scale-100" />
                    ) : (
                      <FaPlay className="size-4 transition-transform group-hover:scale-125 group-active:scale-100" />
                    )}
                  </button>
                </>
              )}
              <div className="relative inline-flex grow overflow-x-auto">
                <div className="flex shrink-0 items-center gap-2 py-2 pl-4 pr-2">
                  <WaveHeights waveHeights={waveHeights} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="https://github.com/taylorkmho/wavwhisperer"
                  target="_blank"
                  className="group shrink-0 rounded-full border-2 border-transparent p-1 hover:border-fuchsia-400/20 hover:bg-gradient-to-br hover:from-fuchsia-400/30 hover:to-indigo-400/30"
                >
                  <FaGithub className="size-4 transition-transform group-hover:scale-125 group-active:scale-100" />
                </Link>
              </div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex h-full shrink-0 items-center pl-2 pr-3 hover:bg-white/5"
              >
                <FaEllipsis className="size-4" />
              </button>
              {["bg-gradient-to-r right-16", "bg-gradient-to-l left-0"].map(
                (classNames, i) => (
                  <div
                    className={cn(
                      "absolute inset-y-0 z-20 h-full w-6",
                      "from-secondary/0 to-secondary",
                      classNames
                    )}
                    key={i}
                  />
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

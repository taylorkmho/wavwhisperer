import { cn } from "@/lib/utils";
import { WaveHeight } from "@/types/noaa";
import Link from "next/link";
import { useState } from "react";
import { FaEllipsis, FaGithub, FaPause, FaPlay } from "react-icons/fa6";
import { useAudio } from "../AudioContext";
import { WaveHeights } from "./WaveHeights";

interface BottomNavProps {
  date: string;
  waveHeights: WaveHeight[];
  onClickDropdown: () => void;
  audioFile?: string;
}

export function BottomNav({
  date,
  waveHeights,
  onClickDropdown,
  audioFile,
}: BottomNavProps) {
  const { isPlaying, play, pause, audioRef } = useAudio();
  const [audioProgress, setAudioProgress] = useState(0);

  const handleAudioEnd = () => {
    pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const updateAudioProgress = () => {
    if (audioRef.current) {
      const progress = audioRef.current.currentTime / audioRef.current.duration;
      setAudioProgress(progress);
    }
  };

  return (
    <nav className="relative flex min-w-0 items-center overflow-clip rounded-full bg-secondary">
      {audioFile && (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-50 bg-indigo-400/10 transition-transform duration-500 ease-linear"
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
              <FaPause className="size-4 transition-transform group-hover:scale-125" />
            ) : (
              <FaPlay className="size-4 transition-transform group-hover:scale-125" />
            )}
          </button>
          <audio
            ref={audioRef}
            className="invisible"
            src={`https://mnegthmftttdlazyjbke.supabase.co/storage/v1/object/public/voiceover/${audioFile}`}
            onEnded={handleAudioEnd}
            onTimeUpdate={updateAudioProgress}
          />
        </>
      )}
      {date && (
        <div
          className="flex h-full w-12 shrink-0 items-center justify-center bg-black/20 text-left text-xs font-bold text-white"
          title={`Last updated: ${new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          })}`}
        >
          {new Date(date).toLocaleDateString("en-US", {
            month: "numeric",
            day: "2-digit",
          })}
        </div>
      )}
      <div className="relative inline-flex grow overflow-x-auto">
        <div className="flex shrink-0 items-center gap-2 py-2 pl-4 pr-2">
          <WaveHeights waveHeights={waveHeights} />
        </div>
      </div>
      <Link
        href="https://github.com/taylorkmho/wavwhisperer"
        target="_blank"
        className="group shrink-0 rounded-full border-2 border-transparent p-1 hover:border-fuchsia-400/20 hover:bg-gradient-to-br hover:from-fuchsia-400/30 hover:to-indigo-400/30"
      >
        <FaGithub className="size-4 transition-transform group-hover:scale-125" />
      </Link>
      <button
        onClick={onClickDropdown}
        className="inline-flex h-full shrink-0 items-center pl-2 pr-3 hover:bg-white/5"
      >
        <FaEllipsis className="size-4" />
      </button>
      {["bg-gradient-to-r right-16", "bg-gradient-to-l left-20"].map(
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
    </nav>
  );
}

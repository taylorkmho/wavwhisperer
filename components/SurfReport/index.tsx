"use client";

import AnimatedPuns from "@/components/AnimatedPuns";
import { CurrentReportDisplay } from "@/components/CurrentReportDisplay";
import { useSurfReport } from "@/hooks/useSurfReport";
import Link from "next/link";
import { useEffect } from "react";
import { useAudio } from "./AudioContext";
import { BottomNav } from "./BottomNav";
import { CrystalBall } from "./CrystalBall";
import { useCurrentReport } from "./CurrentReportContext";

interface SurfReportProps {
  id?: string;
}

export function SurfReport({ id }: SurfReportProps) {
  const { setCurrentReport } = useCurrentReport();
  const { setAudioPath } = useAudio();
  const { data, isLoading, error } = useSurfReport(id);

  useEffect(() => {
    if (data) {
      setCurrentReport(data);
      setAudioPath(data.audioPath || null);
    }
  }, [data, setCurrentReport, setAudioPath]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Telling future...
      </div>
    );
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <section className="relative h-screen w-screen overflow-hidden border-2 border-green-400">
      <CrystalBall poem={data.poem} />
      <BottomNav currentSurfReport={data} />

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
        </div>
      </div>
    </section>
  );
}

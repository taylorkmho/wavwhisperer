"use client";

import { useSurfReport } from "@/hooks/useSurfReport";
import { useEffect } from "react";
import { useAudio } from "./AudioContext";
import { CrystalBall } from "./CrystalBall";
import { useCurrentReport } from "./CurrentReportContext";
import { Overlay } from "./Overlay";

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
    <section className="relative h-screen w-screen overflow-hidden border-0 border-green-400">
      <CrystalBall poem={data.poem} />
      <Overlay />
    </section>
  );
}

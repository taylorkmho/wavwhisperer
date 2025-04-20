import { useNoaaSurfReport } from "@/hooks/useNoaaSurfReport";
import { useEffect } from "react";
import { useAudio } from "./AudioContext";
import { BottomNav } from "./BottomNav";
import { CrystalBall } from "./CrystalBall";
import { useCurrentReport } from "./CurrentReportContext";

export default function SurfReport() {
  const { setCurrentReport } = useCurrentReport();
  const { setAudioPath } = useAudio();
  const { data, isLoading, error } = useNoaaSurfReport();

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
    <section className="relative h-screen w-screen overflow-hidden">
      <CrystalBall poem={data.poem} />
      <BottomNav currentSurfReport={data} />
    </section>
  );
}

import { useNoaaSurfReport } from "@/hooks/useNoaaSurfReport";
import { useEffect } from "react";
import { BottomNav } from "./BottomNav";
import { CrystalBall } from "./CrystalBall";
import { useCurrentReport } from "./CurrentReportContext";

export default function SurfReport() {
  const { setCurrentReport } = useCurrentReport();
  const { data, isLoading, error } = useNoaaSurfReport();

  useEffect(() => {
    if (data) {
      setCurrentReport(data);
    }
  }, [data, setCurrentReport]);

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
      <BottomNav data={data} />
    </section>
  );
}

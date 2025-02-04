import { useNoaaSurfReport } from "@/hooks/useNoaaSurfReport";
import { BottomNav } from "./BottomNav";
import { CrystalBall } from "./CrystalBall";

export default function SurfReport() {
  const { data, isLoading, error } = useNoaaSurfReport();
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

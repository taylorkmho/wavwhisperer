import AnimatedPuns from "@/components/AnimatedPuns";
import { CurrentReportDisplay } from "@/components/CurrentReportDisplay";
import Link from "next/link";

export function Overlay() {
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
      </div>
    </div>
  );
}

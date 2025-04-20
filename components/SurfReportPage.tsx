"use client";

import AnimatedPuns from "@/components/AnimatedPuns";
import { CurrentReportDisplay } from "@/components/CurrentReportDisplay";
import { SurfReport } from "@/components/SurfReport";
import Link from "next/link";

interface SurfReportPageProps {
  id?: string;
}

export function SurfReportPage({ id }: SurfReportPageProps) {
  return (
    <>
      <SurfReport id={id} />

      <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex w-full px-4">
        <div className="order-2 flex justify-between gap-2 lg:flex-row">
          <div className="flex items-start gap-2 text-right">
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
        <div className="order-1 flex grow flex-col gap-4">
          <h1 className="max-w-96 text-6xl font-normal lg:max-w-xl lg:text-8xl">
            Peer into the crystal ball
          </h1>
          <CurrentReportDisplay />
        </div>
      </div>
    </>
  );
}

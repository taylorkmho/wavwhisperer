"use client";

import AnimatedPuns from "@/components/AnimatedPuns";
import { RecentReports } from "@/components/recent-reports";

import SurfReport from "@/components/SurfReport";
import { AudioProvider } from "@/components/SurfReport/AudioContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

const queryClient = new QueryClient();

export default function Home() {
  const [showRecentReports, setShowRecentReports] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AudioProvider>
        <main className="relative">
          <SurfReport />

          <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex w-full flex-wrap items-start justify-between gap-2 px-4">
            <div className="max-w-96 lg:max-w-xl">
              <h1 className="text-6xl font-normal lg:text-8xl">
                Peer into the crystal ball
              </h1>
              <button
                className="pointer-events-auto flex shrink-0 items-center border border-[#2C1DFF]/20 bg-black px-2 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#2C1DFF]"
                onClick={() => setShowRecentReports(true)}
              >
                Get Recent Reports
              </button>
            </div>
            <div className="flex flex-row-reverse items-start gap-2 text-left lg:flex-row lg:text-right">
              <AnimatedPuns />
              <Link
                href="https://tellaho.com/?utm_source=wavewhisperer"
                target="_blank"
                className="pointer-events-auto flex shrink-0 items-center border border-[#2C1DFF]/20 bg-black px-2 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#2C1DFF]"
              >
                /th
              </Link>
            </div>
          </div>

          {showRecentReports && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
              <div className="relative w-full max-w-2xl rounded-lg border border-[#2C1DFF]/20 bg-black p-6">
                <button
                  className="absolute right-4 top-4 text-white hover:text-[#2C1DFF]"
                  onClick={() => setShowRecentReports(false)}
                >
                  ✕
                </button>
                <h2 className="mb-4 text-2xl font-bold text-white">
                  Recent Surf Reports
                </h2>
                <RecentReports />
              </div>
            </div>
          )}
        </main>
      </AudioProvider>
    </QueryClientProvider>
  );
}

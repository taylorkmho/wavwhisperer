"use client";

import AnimatedPuns from "@/components/AnimatedPuns";
import { CurrentReportDisplay } from "@/components/CurrentReportDisplay";
import { RecentReports } from "@/components/recent-reports";
import SurfReport from "@/components/SurfReport";
import { AudioProvider } from "@/components/SurfReport/AudioContext";
import { CurrentReportProvider } from "@/components/SurfReport/CurrentReportContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

const queryClient = new QueryClient();

export default function Home() {
  const [showRecentReports, setShowRecentReports] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <CurrentReportProvider>
        <AudioProvider>
          <main className="relative">
            <SurfReport />

            <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex w-full flex-wrap items-start justify-between gap-2 px-4">
              <div className="max-w-96 lg:max-w-xl">
                <h1 className="text-6xl font-normal lg:text-8xl">
                  Peer into the crystal ball
                </h1>
                <div className="flex flex-row items-center gap-2">
                  <button
                    className="border-brand hover:border-brand/80 group pointer-events-auto flex size-12 shrink-0 items-center justify-center rounded-full border-2 bg-black p-2"
                    onClick={() => setShowRecentReports(true)}
                    title="Recent Surf Reports"
                    aria-label="Recent Surf Reports"
                  >
                    <FaArrowLeft className="size-full group-hover:scale-105 group-active:scale-95" />
                    <span className="sr-only">Recent Surf Reports</span>
                  </button>
                  <CurrentReportDisplay />
                </div>
              </div>
              <div className="flex flex-row-reverse items-start gap-2 text-left lg:flex-row lg:text-right">
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

            {showRecentReports && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <div className="border-brand/20 relative w-full max-w-2xl rounded-lg border bg-black p-6">
                  <button
                    className="hover:text-brand absolute right-4 top-4 text-white"
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
      </CurrentReportProvider>
    </QueryClientProvider>
  );
}

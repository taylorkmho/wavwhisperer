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

const queryClient = new QueryClient();

export default function Home() {
  const [showRecentReports, setShowRecentReports] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <CurrentReportProvider>
        <AudioProvider>
          <main className="relative">
            <SurfReport />

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
                <CurrentReportDisplay
                  onShowRecentReports={() => setShowRecentReports(true)}
                />
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

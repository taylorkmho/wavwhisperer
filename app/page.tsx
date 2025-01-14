"use client";

import AnimatedPuns from "@/components/AnimatedPuns";
import SurfReport from "@/components/SurfReport";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="relative">
        <SurfReport />

        <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex w-full flex-wrap items-start justify-between gap-2 px-4">
          <h1 className="max-w-96 text-6xl font-normal lg:max-w-xl lg:text-8xl">
            Peer into the crystal ball
          </h1>
          <div className="flex flex-row-reverse items-start gap-2 text-left lg:flex-row lg:text-right">
            <AnimatedPuns />
            <Link
              href="https://tellaho.com/?utm_source=wavewhisperer"
              target="_blank"
              className="pointer-events-auto flex shrink-0 items-center border border-[#f40c3f]/20 bg-black px-2 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#f40c3f]"
            >
              /th
            </Link>
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
}

"use client";

import SurfReport from "@/components/SurfReport";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
        <h1 className="absolute left-2 top-2 z-10 max-w-96 text-6xl font-normal">
          Peer into the crystal ball
        </h1>
        <SurfReport />

        <div className="absolute right-2 top-2 flex items-center gap-4 text-right">
          <p className="w-full max-w-64 text-sm uppercase tracking-widest">
            <strong className="block tracking-[0.5rem]">Know the future</strong>
            (Get it, it’s a Surf forecast)
          </p>
        </div>
      </main>
    </QueryClientProvider>
  );
}

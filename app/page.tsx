"use client";

import { Typewriter } from "@/components/typography";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SurfReport from "@/components/SurfReport";

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
      <main className="font-semibold">
        <section>
          <p className="text-center absolute top-0 inset-x-0 px-8 text-4xl md:text-7xl">
            <Typewriter hideCursorOnComplete text="How art thou, surf?" />
          </p>
          <SurfReport />
        </section>
      </main>
    </QueryClientProvider>
  );
}

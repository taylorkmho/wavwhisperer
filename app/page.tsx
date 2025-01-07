"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Typewriter } from "@/components/typography";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WeatherCheck from "@/components/WeatherCheck";
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
          <AnimatePresence>
            <p className="text-center fixed top-0 inset-x-0">
              <Typewriter hideCursorOnComplete text="How art thou, surf?" />
            </p>
            <SurfReport />
          </AnimatePresence>
        </section>
      </main>
    </QueryClientProvider>
  );
}

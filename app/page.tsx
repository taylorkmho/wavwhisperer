"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Typewriter } from "@/components/typography";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Glow } from "./components/Glow";
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
  const [currentStage, setCurrentStage] = useState(0);
  return (
    <QueryClientProvider client={queryClient}>
      <main className="p-4 pb-32 font-semibold lg:px-8">
        <section className="mx-auto max-w-8xl space-y-4">
          <AnimatePresence>
            {currentStage >= 0 && (
              <motion.p key="stage-0" layout>
                <Typewriter
                  hideCursorOnComplete
                  text="What’s your excuse?"
                  onComplete={() => setCurrentStage(1)}
                />
              </motion.p>
            )}
            {currentStage >= 1 && (
              <motion.div
                layout
                key="stage-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SurfReport />
              </motion.div>
            )}
            {currentStage >= 2 && currentStage < 3 && (
              <motion.div
                layout
                key="stage-2"
                className="flex gap-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Glow>
                  <button
                    className={cn(buttonVariants({ size: "lg" }))}
                    onClick={() => setCurrentStage(3)}
                  >
                    Get started
                  </button>
                </Glow>
                <motion.button
                  className={buttonVariants({ variant: "ghost", size: "lg" })}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  onClick={() => setCurrentStage(3)}
                >
                  Learn more
                </motion.button>
              </motion.div>
            )}
            {currentStage >= 3 && <WeatherCheck />}
          </AnimatePresence>
        </section>
      </main>
    </QueryClientProvider>
  );
}

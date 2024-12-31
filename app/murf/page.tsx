"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Typewriter } from "@/components/typography";

import { Glow } from "../components/Glow";

export default function IndexPage() {
  const [currentStage, setCurrentStage] = useState(0);
  return (
    <main className="p-4 pb-32 font-semibold lg:px-8">
      <section className="mx-auto max-w-8xl space-y-4">
        <AnimatePresence>
          <motion.p key="stage-0">
            <span className="font-pixel text-5xl font-medium leading-none">
              ALOHA NŌ, THIS IS TAYLOR HO
            </span>
            <Typewriter
              hideCursorOnComplete
              text="’S GET SWOLE BOT 💪🏽"
              onComplete={() => setCurrentStage(1)}
            />
          </motion.p>
          {currentStage >= 1 && currentStage < 3 && (
            <motion.p
              key="stage-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Typewriter
                hideCursorOnComplete
                text="Fitness and health is life. You wanting to work out?"
                onComplete={() => setCurrentStage(2)}
              />
            </motion.p>
          )}
          {currentStage >= 2 && currentStage < 3 && (
            <motion.div
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
                  Build a workout
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
        </AnimatePresence>
      </section>
    </main>
  );
}

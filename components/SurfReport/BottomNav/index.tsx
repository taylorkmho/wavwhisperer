import { cn } from "@/lib/utils";
import { SurfReport } from "@/types/noaa";
import { motion } from "framer-motion";
import { decode } from "html-entities";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaEllipsis, FaGithub } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { WaveHeights } from "./WaveHeights";

interface BottomNavProps {
  currentSurfReport?: SurfReport;
}

export function BottomNav({ currentSurfReport }: BottomNavProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!currentSurfReport) {
    return null;
  }

  const { waveHeights } = currentSurfReport;

  return (
    <nav className="pointer-events-auto h-full items-end md:flex">
      {isDropdownOpen && (
        <motion.div
          className="flex flex-col items-center space-y-2"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          key="dropdown"
        >
          <div className="relative mx-auto max-w-lg overflow-hidden rounded-xl bg-black/70 font-mono text-sm font-normal text-muted-foreground backdrop-blur-lg">
            <div className="max-h-48 space-y-2 overflow-y-auto p-4">
              {currentSurfReport.discussion.map((paragraph, index) => (
                <p key={index}>{decode(paragraph)}</p>
              ))}
            </div>
          </div>
          <div className="inline-flex items-center gap-2 overflow-hidden rounded-lg bg-secondary text-xs">
            <div className="flex grow items-center gap-2 py-1 pl-1">
              <Image
                src="/noaa_digital_logo.svg"
                alt="NOAA"
                width={30}
                height={30}
              />
              <h6 className="flex min-w-0 grow flex-col gap-0.5 leading-none">
                <span className="text-muted-foreground">
                  Report data pulled from
                </span>{" "}
                <Link
                  href="https://www.weather.gov/hfo/SRF"
                  className="truncate font-bold decoration-foreground/50 underline-offset-2 hover:underline"
                  target="_blank"
                >
                  National Oceanic and Atmospheric Administration
                </Link>
              </h6>
            </div>
            <button
              onClick={() => setIsDropdownOpen(false)}
              className="inline-flex h-full shrink-0 items-center py-2 pl-1.5 pr-2.5 text-xs hover:bg-white/5"
            >
              <IoClose className="size-5" />
            </button>
          </div>
        </motion.div>
      )}
      {!isDropdownOpen && (
        <motion.div
          className="flex h-full justify-center"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          key="bottom-nav"
        >
          <div className="relative flex h-full min-w-0 items-center overflow-clip rounded-lg bg-secondary">
            <div className="relative inline-flex h-full grow overflow-x-auto">
              <div className="flex h-full shrink-0 items-center gap-2 py-2 pl-4 pr-2">
                <WaveHeights waveHeights={waveHeights} />
              </div>
            </div>
            <div className="flex h-full items-center gap-2">
              <Link
                href="https://github.com/taylorkmho/wavwhisperer"
                target="_blank"
                className="group shrink-0 rounded-full border-2 border-transparent p-1 hover:border-fuchsia-400/20 hover:bg-gradient-to-br hover:from-fuchsia-400/30 hover:to-indigo-400/30"
              >
                <FaGithub className="size-4 transition-transform group-hover:scale-125 group-active:scale-100" />
              </Link>
            </div>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex h-full shrink-0 items-center pl-2 pr-3 hover:bg-white/5"
            >
              <FaEllipsis className="size-4" />
            </button>
            {["bg-gradient-to-r right-16", "bg-gradient-to-l left-0"].map(
              (classNames, i) => (
                <div
                  className={cn(
                    "absolute inset-y-0 z-20 h-full w-6",
                    "from-secondary/0 to-secondary",
                    classNames
                  )}
                  key={i}
                />
              )
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

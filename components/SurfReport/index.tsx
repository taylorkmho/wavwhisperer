import { useNoaaSurfReport } from "@/hooks/useNoaaSurfReport";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { decode } from "html-entities";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { BottomNav } from "./BottomNav";
import { CrystalBall } from "./CrystalBall";

export default function SurfReport() {
  const { data, isLoading, error } = useNoaaSurfReport();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Telling future...
      </div>
    );
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-4">
      {data.discussion && data.discussion.length > 0 && (
        <>
          <section className="relative h-screen w-screen overflow-hidden">
            <div className="absolute inset-x-0 z-10 flex flex-col items-center gap-2 pt-2">
              {data.lastBuildDate && (
                <p className="rounded-md border-2 border-fuchsia-500/20 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-2 text-xs md:text-sm">
                  Hawai‘i surf report{" "}
                  <strong>
                    {new Date(data.lastBuildDate).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </strong>
                </p>
              )}
              <h1 className="font-pixel text-5xl font-normal md:text-7xl">
                Rub the crystal ball
              </h1>
            </div>
            <CrystalBall poem={data.poem} />
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="absolute inset-x-0 bottom-4 flex flex-col items-center space-y-2 px-4"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  key="dropdown"
                >
                  <div className="relative mx-auto max-w-lg overflow-hidden rounded-xl bg-muted font-mono text-sm font-normal text-muted-foreground">
                    <div className="max-h-48 space-y-2 overflow-y-auto p-4">
                      {data.discussion.map((paragraph, index) => (
                        <p key={index}>{decode(paragraph)}</p>
                      ))}
                    </div>
                    {[
                      "bg-gradient-to-t top-0",
                      "bg-gradient-to-b bottom-0",
                    ].map((classNames, i) => (
                      <div
                        className={cn(
                          "absolute inset-x-0 z-20 h-6",
                          "from-muted/0 to-muted",
                          classNames
                        )}
                        key={i}
                      />
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-2 overflow-hidden rounded-full bg-secondary text-xs">
                    <div className="flex grow items-center gap-2 py-1 pl-1">
                      <Image
                        src="/noaa_digital_logo.svg"
                        alt="NOAA"
                        width={30}
                        height={30}
                      />
                      <h6 className="flex min-w-0 flex-col gap-0.5 leading-none">
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
                  className="absolute inset-x-0 bottom-4 flex justify-center px-4"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  key="bottom-nav"
                >
                  <BottomNav
                    waveHeights={data.waveHeights}
                    onClickDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </>
      )}
    </div>
  );
}

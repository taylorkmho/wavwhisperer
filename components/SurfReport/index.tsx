import { useNoaaSurfReport } from "@/hooks/useNoaaSurfReport";
import { cn } from "@/lib/utils";
import { decode } from "html-entities";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { CrystalBall } from "./CrystalBall";
import { WaveHeights } from "./WaveHeights";

export default function SurfReport() {
  const {
    data: report,
    isLoading: reportLoading,
    error: reportError,
  } = useNoaaSurfReport();
  const [currentPoem, setCurrentPoem] = useState<string[]>([]);

  if (reportLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Telling future...
      </div>
    );
  }

  if (reportError) {
    return <div>Error loading data: {reportError.message}</div>;
  }

  if (!report) {
    return null;
  }

  return (
    <div className="space-y-4">
      {report.discussion && report.discussion.length > 0 && (
        <>
          <section className="relative h-screen w-screen">
            <div className="absolute inset-x-0 z-10 flex flex-col items-center gap-2 pt-2">
              {report.lastBuildDate && (
                <p className="rounded-md border-2 border-fuchsia-500/20 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-2 text-xs md:text-sm">
                  Hawai‘i surf report{" "}
                  <strong>
                    {new Date(report.lastBuildDate).toLocaleString("en-US", {
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
            <CrystalBall
              poem={currentPoem}
              discussion={report.discussion}
              surfReportId={report.id}
              onGenerate={setCurrentPoem}
            />
            <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
              <nav className="relative flex min-w-0 items-center overflow-clip rounded-full bg-secondary">
                <Link
                  href="https://github.com/taylorkmho/wavewhisperer"
                  target="_blank"
                  className="shrink-0 pl-4 pr-2"
                >
                  <FaGithub className="size-4" />
                </Link>
                <div className="relative inline-flex grow overflow-x-auto">
                  <div className="flex shrink-0 items-center gap-2 py-2 pl-4 pr-2">
                    <WaveHeights waveHeights={report.waveHeights} />
                  </div>
                </div>
                {["bg-gradient-to-r right-0", "bg-gradient-to-l left-10"].map(
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
              </nav>
            </div>
          </section>
          <section className="mx-auto w-full max-w-5xl space-y-4 px-4 pb-12">
            <div className="space-y-2 font-mono text-sm font-normal text-secondary-foreground">
              {report.discussion.map((paragraph, index) => (
                <p key={index}>{decode(paragraph)}</p>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Image
                src="/noaa_digital_logo.svg"
                alt="NOAA"
                width={28}
                height={28}
              />
              <h6 className="flex flex-col gap-0.5 leading-none">
                <span className="text-muted-foreground">
                  Report data pulled from
                </span>{" "}
                <Link
                  href="https://www.weather.gov/hfo/SRF"
                  className="font-bold decoration-foreground/50 underline-offset-2 hover:underline"
                  target="_blank"
                >
                  National Oceanic and Atmospheric Administration
                </Link>
              </h6>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

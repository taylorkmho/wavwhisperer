import { useNoaaSurfReport } from "@/hooks/useNoaaSurfReport";
import { decode } from "html-entities";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CrystallBall } from "../CrystallBall";
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
          <div className="relative h-[100vh]">
            <div className="absolute inset-x-0 left-2 top-0 z-10 flex flex-col items-center gap-2 pt-2">
              {report.lastBuildDate && (
                <p className="rounded-md border border-fuchsia-500/20 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-2 text-xs md:text-sm">
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
              <Typewriter
                hideCursorOnComplete
                text="Rub the crystal ball"
                className="text-4xl md:text-7xl"
              />
            </div>
            <CrystallBall
              poem={currentPoem}
              discussion={report.discussion}
              surfReportId={report.id}
              onGenerate={setCurrentPoem}
            />
            <div className="absolute inset-x-0 bottom-4">
              <WaveHeights waveHeights={report.waveHeights} />
            </div>
          </div>
          <div className="mx-auto w-full max-w-5xl space-y-4 px-4 pb-12">
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
          </div>
        </>
      )}
    </div>
  );
}

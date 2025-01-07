import { decode } from "html-entities";
import Image from "next/image";
import { useNoaaSurfReport } from "@/hooks/useNoaaSurfReport";
import Link from "next/link";
import {
  FaArrowRightLong,
  FaArrowTrendDown,
  FaArrowTrendUp,
} from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { CrystallBall } from "../CrystallBall";
import { Typewriter } from "../typography";
export default function SurfReport() {
  const { data: report, isLoading, error } = useNoaaSurfReport();

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Telling future...
      </div>
    );
  }

  if (error) {
    return <div>Error loading surf report</div>;
  }

  if (!report) {
    return null;
  }

  return (
    <div className="space-y-4">
      {report.discussion && report.discussion.length > 0 && (
        <>
          <div className="relative h-[100vh]">
            <div className="z-10 pt-2 text-center absolute top-0 inset-x-0 px-8 flex flex-col items-center justify-center">
              {report.lastBuildDate && (
                <p className="text-xs md:text-sm text-center px-2 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-fuchsia-500/20 rounded-md">
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
                text="How art thou, surf?"
                className="text-4xl md:text-7xl"
              />
            </div>
            <CrystallBall poem={report.poem} />
            <div className="absolute bottom-4 inset-x-0 flex flex-col gap-2">
              <div className="flex flex-wrap gap-4 justify-center px-4 pb-2">
                {report.waveHeights.map((wave, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-center text-card-foreground"
                  >
                    <h6 className="font-semibold text-muted-foreground text-xs">
                      {wave.direction}
                    </h6>

                    <span className="text-sm md:text-base text-secondary-foreground font-bold">
                      {wave.height} ft
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1.5 text-xs rounded-full px-2 h-5",
                        wave.trend === "increasing" &&
                          "text-green-500 bg-green-500/10",
                        wave.trend === "decreasing" &&
                          "text-red-500 bg-red-500/10",
                        wave.trend === "steady" &&
                          "text-muted-foreground bg-muted-foreground/10"
                      )}
                      title={
                        wave.trend === "increasing"
                          ? "Increasing"
                          : wave.trend === "decreasing"
                          ? "Decreasing"
                          : "Steady"
                      }
                    >
                      {wave.trend &&
                        (wave.trend === "increasing" ? (
                          <FaArrowTrendUp className="size-3" />
                        ) : wave.trend === "decreasing" ? (
                          <FaArrowTrendDown className="size-3" />
                        ) : (
                          <FaArrowRightLong className="size-3" />
                        ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto w-full pb-12 px-4 space-y-4">
            <div className="space-y-2 text-sm text-secondary-foreground font-normal font-mono">
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
              <h6 className="flex flex-col leading-none gap-0.5">
                <span className="text-muted-foreground">
                  Report data pulled from
                </span>{" "}
                <Link
                  href="https://www.weather.gov/hfo/SRF"
                  className="font-bold hover:underline underline-offset-2 decoration-foreground/50"
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

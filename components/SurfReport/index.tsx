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
export default function SurfReport() {
  const { data: report, isLoading, error } = useNoaaSurfReport();

  if (isLoading) {
    return <div>Loading surf report...</div>;
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
          {report.lastBuildDate && (
            <p className="text-2xl font-bold">
              {new Date(report.lastBuildDate).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
          {report.poem?.map((line, index) => (
            <div
              key={index}
              className="font-serif text-3xl text-muted-foreground italic"
            >
              {line}
            </div>
          ))}

          <div className="flex flex-wrap gap-4">
            {report.waveHeights.map((wave, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-center text-card-foreground"
              >
                <h6 className="font-semibold text-muted-foreground text-xs">
                  {wave.direction}
                </h6>

                <span className="text-base text-secondary-foreground font-bold">
                  {wave.height} ft
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-xs rounded-full px-2 h-5",
                    wave.trend === "increasing" &&
                      "text-green-500 bg-green-500/10",
                    wave.trend === "decreasing" && "text-red-500 bg-red-500/10",
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
        </>
      )}
    </div>
  );
}

import { decode } from "html-entities";
import Image from "next/image";
import { useNoaaSurfReport } from "@/hooks/useNoaaSurfReport";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  FaArrowRightLong,
  FaArrowTrendDown,
  FaArrowTrendUp,
} from "react-icons/fa6";
import { cn } from "@/lib/utils";
export default function SurfReport({ island = "oahu" }: { island?: string }) {
  const { data: report, isLoading, error } = useNoaaSurfReport(island);

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
    <div className="space-y-6">
      {report.discussion && report.discussion.length > 0 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-4xl font-bold">
              {new Date(report.lastBuildDate).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <div className="space-y-2 text-base font-mono">
              {report.discussion.map((paragraph, index) => (
                <p key={index}>{decode(paragraph)}</p>
              ))}
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {report.waveHeights.map((wave, index) => (
                <div
                  key={index}
                  className="text-center rounded-lg border p-4 text-card-foreground"
                >
                  <h6 className="font-semibold text-muted-foreground text-sm">
                    {wave.direction}
                  </h6>
                  <div className="flex flex-col items-center justify-center gap-2 mt-2 text-2xl font-bold">
                    <span>{wave.height} ft</span>
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
                    >
                      {wave.trend &&
                        (wave.trend === "increasing" ? (
                          <>
                            <FaArrowTrendUp className="size-3" />
                            Increasing
                          </>
                        ) : wave.trend === "decreasing" ? (
                          <>
                            <FaArrowTrendDown className="size-3" />
                            Decreasing
                          </>
                        ) : (
                          <>
                            <FaArrowRightLong className="size-3" />
                            Steady
                          </>
                        ))}
                    </span>
                  </div>
                </div>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}

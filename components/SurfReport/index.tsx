import { decode } from "html-entities";
import Image from "next/image";
import { useNoaaSurfReport } from "@/hooks/useNoaaSurfReport";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  FaArrowRightLong,
  FaArrowTrendDown,
  FaArrowTrendUp,
} from "react-icons/fa6";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
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
      <p className="text-sm">
        <span className="text-muted-foreground">Last updated:</span>{" "}
        <strong>
          {new Date(report.lastBuildDate).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            year: "numeric",
            hour12: true,
          })}
        </strong>
      </p>

      {report.discussion && report.discussion.length > 0 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2 text-base font-mono">
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
          </CardContent>
        </Card>
      )}

      {/* Wave Heights */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-semibold">Wave Heights</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {report.waveHeights.map((wave, index) => (
              <div
                key={index}
                className="text-center rounded-lg border bg-card p-4 text-card-foreground"
              >
                <h6 className="font-semibold text-sm">{wave.direction}</h6>
                <div className="flex justify-center gap-2 mt-2 text-2xl font-bold">
                  <span>{wave.height} ft</span>
                  <TooltipProvider delayDuration={250}>
                    <Tooltip>
                      {wave.trend &&
                        (wave.trend === "increasing" ? (
                          <>
                            <TooltipTrigger className="opacity-50 hover:opacity-100 transition-opacity delay-250 duration-250">
                              <FaArrowTrendUp className="size-5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>Increasing</TooltipContent>
                          </>
                        ) : wave.trend === "decreasing" ? (
                          <>
                            <TooltipTrigger className="opacity-50 hover:opacity-100 transition-opacity delay-250 duration-250">
                              <FaArrowTrendDown className="size-5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>Decreasing</TooltipContent>
                          </>
                        ) : (
                          <>
                            <TooltipTrigger className="opacity-50 hover:opacity-100 transition-opacity delay-250 duration-250">
                              <FaArrowRightLong className="size-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>Steady</TooltipContent>
                          </>
                        ))}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General Day Info */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-semibold">Conditions</h3>
          <div className="space-y-4">
            {report.generalDayInfo.map((info, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-4" />}
                <h4 className="mb-2 font-medium">{info.day}</h4>
                <dl className="grid gap-2 text-sm">
                  <div className="grid grid-cols-2">
                    <dt className="text-muted-foreground">Weather</dt>
                    <dd>{info.weather}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-muted-foreground">Temperature</dt>
                    <dd>{info.temperature}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-muted-foreground">Winds</dt>
                    <dd>{info.winds}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-muted-foreground">Sunrise/Sunset</dt>
                    <dd>
                      {info.sunrise} / {info.sunset}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

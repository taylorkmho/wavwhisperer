import { cn } from "@/lib/utils";
import {
  FaArrowRightLong,
  FaArrowTrendDown,
  FaArrowTrendUp,
} from "react-icons/fa6";

type WaveHeight = {
  direction: string;
  height: string;
  trend: "increasing" | "decreasing" | "steady";
  order: number;
};

interface WaveHeightsProps {
  variant?: "default" | "display";
  waveHeights: WaveHeight[];
}

export function WaveHeights({
  waveHeights,
  variant = "default",
}: WaveHeightsProps) {
  return (
    <div
      className={cn(
        "gap-4",
        variant === "default" && "flex",
        variant === "display" && "grid w-full grid-cols-4"
      )}
    >
      {waveHeights.map((wave, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center text-center text-card-foreground",
            variant === "default" && "gap-2",
            variant === "display" && "flex-col"
          )}
        >
          <h6 className="text-xs font-semibold text-muted-foreground">
            {wave.direction}
          </h6>

          <span
            className={cn(
              "text-sm font-bold text-secondary-foreground md:text-base",
              variant === "display" && "text-xl leading-none md:text-xl"
            )}
          >
            {wave.height}
            {variant === "display" ? <>&rsquo;</> : " ft"}
          </span>
          <span
            className={cn(
              "flex h-5 items-center gap-1.5 rounded-full px-2 text-xs",
              wave.trend === "increasing" && "bg-green-500/10 text-green-500",
              wave.trend === "decreasing" && "bg-red-500/10 text-red-500",
              variant === "default" &&
                wave.trend === "steady" &&
                "bg-muted-foreground/10 text-muted-foreground"
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
              {
                increasing: <FaArrowTrendUp className="size-3" />,
                decreasing: <FaArrowTrendDown className="size-3" />,
                steady: variant === "default" && (
                  <FaArrowRightLong className="size-3" />
                ),
              }[wave.trend]}
          </span>
        </div>
      ))}
    </div>
  );
}

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
  waveHeights: WaveHeight[];
}

export function WaveHeights({ waveHeights }: WaveHeightsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {waveHeights.map((wave, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-center text-card-foreground"
        >
          <h6 className="text-xs font-semibold text-muted-foreground">
            {wave.direction}
          </h6>

          <span className="text-sm font-bold text-secondary-foreground md:text-base">
            {wave.height} ft
          </span>
          <span
            className={cn(
              "flex h-5 items-center gap-1.5 rounded-full px-2 text-xs",
              wave.trend === "increasing" && "bg-green-500/10 text-green-500",
              wave.trend === "decreasing" && "bg-red-500/10 text-red-500",
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
  );
}

import { cn } from "@/lib/utils";
import { WaveHeight } from "@/types/noaa";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { WaveHeights } from "./WaveHeights";

interface BottomNavProps {
  waveHeights: WaveHeight[];
}

export function BottomNav({ waveHeights }: BottomNavProps) {
  return (
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
          <WaveHeights waveHeights={waveHeights} />
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
  );
}

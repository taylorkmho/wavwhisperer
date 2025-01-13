import { cn } from "@/lib/utils";
import { WaveHeight } from "@/types/noaa";
import Link from "next/link";
import { FaAngleDown, FaGithub } from "react-icons/fa6";
import { WaveHeights } from "./WaveHeights";

interface BottomNavProps {
  waveHeights: WaveHeight[];
}

export function BottomNav({ waveHeights }: BottomNavProps) {
  return (
    <nav className="relative flex min-w-0 items-center overflow-clip rounded-full bg-secondary">
      <div className="relative inline-flex grow overflow-x-auto">
        <div className="flex shrink-0 items-center gap-2 py-2 pl-4 pr-2">
          <WaveHeights waveHeights={waveHeights} />
        </div>
      </div>
      <Link
        href="https://github.com/taylorkmho/wavewhisperer"
        target="_blank"
        className="group shrink-0 rounded-full border-2 border-transparent p-1 hover:border-fuchsia-400/20 hover:bg-gradient-to-br hover:from-fuchsia-400/30 hover:to-indigo-400/30"
      >
        <FaGithub className="size-4 transition-transform group-hover:scale-125" />
      </Link>
      <Link
        href="https://github.com/taylorkmho/wavewhisperer"
        target="_blank"
        className="inline-flex h-full shrink-0 items-center pl-2 pr-3 hover:bg-white/5"
      >
        <FaAngleDown className="size-4" />
      </Link>
      {["bg-gradient-to-r right-16", "bg-gradient-to-l left-0"].map(
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

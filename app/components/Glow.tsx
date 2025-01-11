import { cn } from "@/lib/utils";

interface GlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Glow({ children, className, ...props }: GlowProps) {
  return (
    <div className="relative" {...props}>
      <div className="relative z-10">{children}</div>
      <span
        className={cn(
          "animate-glow absolute inset-0 -z-10 bg-gradient-to-l from-cyan-500/80 via-amber-500/80 to-violet-500/80 bg-[length:200%_200%] blur-xl",
          className
        )}
      />
    </div>
  );
}

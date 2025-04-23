import { cn } from "@/lib/utils";

// pass Button props as props
interface ButtonVibesProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}
export function ButtonVibes({
  isActive,
  className,
  children,
  ...props
}: ButtonVibesProps) {
  return (
    <button
      className={cn(
        "hover:scale-[103%] active:scale-[95%]",
        isActive && "scale-95 hover:scale-95 active:scale-[90%]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

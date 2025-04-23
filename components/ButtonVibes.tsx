import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// pass Button props as props
interface ButtonVibesProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export const ButtonVibes = forwardRef<HTMLButtonElement, ButtonVibesProps>(
  ({ isActive, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
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
);

ButtonVibes.displayName = "ButtonVibes";

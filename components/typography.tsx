"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export const Label: React.FC<{
  children: string | React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <h6
      className={cn(
        "font-pixel text-3xl text-violet-500 dark:text-violet-300",
        className
      )}
    >
      {children}
    </h6>
  );
};

export function Typewriter({
  text,
  onComplete,
  hideCursorOnComplete = false,
}: {
  text: string;
  onComplete?: () => void;
  hideCursorOnComplete?: boolean;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (hasCompletedRef.current) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        hasCompletedRef.current = true;
        onComplete?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span className="font-pixel text-9xl font-medium leading-none">
      {displayedText}
      {(!hideCursorOnComplete || !hasCompletedRef.current) && (
        <motion.span
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0, 1] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="relative -bottom-0.5 inline-block h-[0.6em] w-[0.3em] bg-current"
        />
      )}
    </span>
  );
}

export const CompressedText = ({ text }: { text: string }) => {
  const [letterSpacing, setLetterSpacing] = useState(-0.05);
  return (
    <motion.span
      initial={{ letterSpacing: "0.1em" }}
      animate={{
        letterSpacing: "0em",
      }}
      whileHover={{
        letterSpacing: `${letterSpacing}em`,
        transition: { delay: 0 },
      }}
      transition={{
        type: "spring",
        stiffness: 1000,
        damping: 5,
      }}
      onClick={() =>
        setLetterSpacing((prev) =>
          prev === -0.2 ? -0.1 : Math.max(prev - 0.05, -0.2)
        )
      }
      className="cursor-col-resize select-none"
    >
      {text}
    </motion.span>
  );
};

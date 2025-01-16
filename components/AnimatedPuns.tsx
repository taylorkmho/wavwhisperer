import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const puns = [
  "Sea the future",
  "Wave to tomorrow",
  "Deep learning, deeper water",
  "Large wave model",
  "SURF-GPT (GNARLY PREDICTION",
  "TRANSFORMER)",
  "THE ORACLE OF OCEANSIDE",
  "PROPHECY WITH A PORPOISE",
  "FINE-TUNING THE PIPELINE",
  "THE WAVE WHISPERER",
  "CTRL+SEA",
  "SEAMANTIC SEARCH",
];

const SLIDE_INTERVAL = 2000;

export default function AnimatedPuns() {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    setHeight(measureRef.current.offsetHeight);
  }, [measureRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % puns.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-72 border-2 border-red-400"
      style={{
        height: height * 2 || "auto",
      }}
    >
      <motion.div
        animate={{ y: -currentIndex * height }}
        transition={{
          duration: SLIDE_INTERVAL / 1000 - 1,
          ease: "easeInOut",
          delay: 0,
        }}
        className="absolute w-72 whitespace-nowrap border-x-2 border-emerald-400 text-sm"
      >
        <span
          ref={measureRef}
          className="absolute right-0 top-0 block"
          aria-hidden="true"
        >
          |
        </span>
        {[...puns, ...puns.slice(0, 2)].map((pun, index) => {
          return <div key={index}>{pun}</div>;
        })}
      </motion.div>
    </div>
  );
}

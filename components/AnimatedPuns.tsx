import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const puns = [
  <>
    <p>Sea the future</p>
    <p>Wave to tomorrow</p>
  </>,
  <>
    <p>Deep learning, deeper water</p>
    <p>Large wave model</p>
  </>,
  <>
    <p>SURF-GPT (GNARLY PREDICTION</p>
    <p>TRANSFORMER)</p>
  </>,
  <>
    <p>THE ORACLE OF OCEANSIDE</p>
    <p>PROPHECY WITH A PORPOISE</p>
  </>,
  <>
    <p>FINE-TUNING THE PIPELINE</p>
    <p>THE WAVE WHISPERER</p>
  </>,
  <>
    <p>CTRL+SEA</p>
    <p>SEAMANTIC SEARCH</p>
  </>,
];

const SLIDE_INTERVAL = 8000;

export default function AnimatedPuns() {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    setHeight(measureRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % puns.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      style={{
        height,
      }}
      className="relative w-72 overflow-hidden text-sm uppercase tracking-widest"
    >
      <span
        ref={measureRef}
        className="absolute right-0 top-0 block opacity-0"
        aria-hidden="true"
      >
        |<br />|
      </span>
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          initial={{
            y: height,
            opacity: 0.25,
          }}
          animate={{ y: 0, opacity: 1 }}
          exit={{
            y: -height,
            opacity: 0.25,
            transformOrigin: "bottom",
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="absolute w-full whitespace-nowrap tracking-widest"
        >
          <div>{puns[currentIndex]}</div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

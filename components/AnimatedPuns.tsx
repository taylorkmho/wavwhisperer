import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";

const puns = [
  "Sea the future",
  "Wave to tomorrow",
  "Deep learning, deeper water",
  "Large wave model",
  "SURF-GPT (GNARLY PREDICTION TRANSFORMER)",
  "THE ORACLE OF OCEANSIDE",
  "PROPHECY WITH A PORPOISE",
  "FINE-TUNING THE PIPELINE",
  "THE WAVE WHISPERER",
  "CTRL+SEA",
];

export default function AnimatedPuns() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animateText = async () => {
      let currentIndex = 0;
      while (true) {
        await animate(
          scope.current,
          { y: -currentIndex * 20 },
          { duration: 2, ease: "anticipate" }
        );
        currentIndex += 2;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    };

    animateText();
  }, [animate, scope]);

  return (
    <div
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 40px, 0 40px)",
        overflow: "hidden",
      }}
    >
      <motion.p ref={scope} className="text-sm uppercase tracking-widest">
        {[...puns, ...puns, ...puns].map((pun, index) => (
          <span key={index} className="block">
            {pun}
          </span>
        ))}
      </motion.p>
    </div>
  );
}

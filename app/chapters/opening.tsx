"use client";

import { motion } from "framer-motion";
import { EASE, Tint, useParallax } from "../ui";

const BEATS = [
  "Hi, Shreya.",
  "I know how much you love watching Netflix...",
  "...so I decided to take on the director's chair.",
  "So let's begin. Grab your popcorn.",
];

const HOLD = 3.5;
export const DURATION = BEATS.length * HOLD + 5;

export default function Opening({ onBegin }: { onBegin: () => void }) {
  const { px, py } = useParallax(0.3);

  return (
    <div className="relative grid min-h-screen place-items-center px-4 text-center overflow-hidden bg-[#0B0B0D]">
      <motion.div style={{ x: px, y: py }} className="relative w-full max-w-2xl px-2">
        {BEATS.map((b, i) => (
          <motion.p
            key={b}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: HOLD,
              delay: i * (HOLD - 0.4),
              times: [0, 0.2, 0.8, 1],
              ease: "linear",
            }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 font-(family-name:--font-display) text-2xl leading-relaxed font-light text-white sm:text-4xl md:text-5xl tracking-wide will-change-transform max-w-full px-2"
          >
            {b}
          </motion.p>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: BEATS.length * (HOLD - 0.4) + 0.4, ease: EASE }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2"
        >
          <motion.button
            onClick={onBegin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="mx-auto flex items-center gap-3 rounded-full border border-purple-400/60 bg-purple-950/40 px-8 py-3.5 text-xs sm:text-sm tracking-[0.25em] uppercase transition-all hover:border-purple-300 hover:bg-purple-900/60 text-white shadow-xl shadow-purple-950/50"
          >
            <span className="text-purple-400 text-base sm:text-lg">▶</span> Press Play
          </motion.button>
          <p className="mt-5 text-[9px] sm:text-[10px] tracking-[0.35em] text-white/40 uppercase">
            Best with headphones & sound
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}




"use client";

import { motion } from "framer-motion";

export default function NetflixIntro({ onComplete }: { onComplete: () => void }) {
  const glowStyle = "shadow-[0_0_60px_15px_rgba(168,85,247,0.7)]";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 6.5, times: [0, 0.9, 1] }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0D] overflow-hidden select-none"
    >
      {/* Dynamic Ambient Lens Flare */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.7, 0], scale: [0.5, 2.0, 2.8] }}
        transition={{ duration: 3.6, ease: "easeOut" }}
        className="absolute size-[600px] rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 blur-3xl pointer-events-none"
      />

      {/* T shape + text stacked vertically */}
      <div className="relative flex flex-col items-center gap-10">

        {/* "T" Letter Shape */}
        <div className="flex flex-col items-center">
          {/* Horizontal top bar */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 6, times: [0, 0.15, 1], ease: "circOut" }}
            className={`h-9 sm:h-12 w-40 sm:w-56 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 ${glowStyle}`}
            style={{ transformOrigin: "center" }}
          />
          {/* Vertical stem */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 6, delay: 0.1, times: [0, 0.15, 1], ease: "circOut" }}
            className={`h-36 sm:h-48 w-9 sm:w-12 bg-gradient-to-b from-pink-500 via-purple-600 to-indigo-600 ${glowStyle}`}
            style={{ transformOrigin: "top" }}
          />
        </div>

        {/* Brand text — fades in BELOW the T */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0], y: [10, 0, 0] }}
          transition={{ duration: 5.6, delay: 0.4, times: [0, 0.15, 1] }}
          className="flex flex-col items-center gap-2 pointer-events-none text-center px-4"
        >
          <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.9)]">
            A MEMORY SERIES
          </span>
          <p className="text-[10px] sm:text-xs font-mono tracking-[0.4em] sm:tracking-[0.5em] text-purple-300 uppercase">
            ORIGINAL
          </p>
        </motion.div>
      </div>

      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors"
      >
        Skip Intro ➔
      </button>
    </motion.div>
  );
}

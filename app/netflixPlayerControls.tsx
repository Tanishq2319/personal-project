"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function NetflixPlayerControls({
  episodeNumber,
  totalEpisodes,
  title,
  onNext,
  onPrev,
  onHub,
}: {
  episodeNumber: number;
  totalEpisodes: number;
  title: string;
  onNext: () => void;
  onPrev: () => void;
  onHub: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute bottom-0 inset-x-0 z-50 px-8 py-5 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Episode Info */}
        <div className="flex items-center gap-4">
          <button
            onClick={onHub}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs tracking-widest text-white uppercase backdrop-blur-md transition-colors hover:border-purple-400 hover:bg-white/20"
          >
            ← Netflix Hub
          </button>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase">
              EPISODE {String(episodeNumber).padStart(2, "0")} OF {totalEpisodes}
            </span>
            <h4 className="text-sm font-light text-white">{title}</h4>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={onPrev}
            disabled={episodeNumber <= 1}
            className="p-2 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
            title="Previous Episode"
          >
            ⏮
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="size-10 rounded-full bg-white text-black font-bold flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>

          <button
            onClick={onNext}
            disabled={episodeNumber >= totalEpisodes}
            className="p-2 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
            title="Next Episode"
          >
            ⏭
          </button>
        </div>

        {/* Right: Quality */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-green-400" /> 1080p Memory HD
          </span>
          <span className="border border-white/20 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono">
            CC / Subtitles
          </span>
        </div>
      </div>
    </motion.div>
  );
}


"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { STOCK, img } from "./unsplash";

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  accent: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "The Beginning",
    subtitle: "22 March 2022 • Where it all started",
    tag: "EPISODE 01",
    image: STOCK.autumn,
    accent: "var(--color-ember)",
  },
  {
    id: 2,
    title: "You",
    subtitle: "Observations & Small details",
    tag: "EPISODE 02",
    image: STOCK.orchid,
    accent: "var(--color-rose)",
  },
  {
    id: 3,
    title: "Our Moments",
    subtitle: "Mudcups, Rain walks & College Fest",
    tag: "EPISODE 03",
    image: STOCK.cafe,
    accent: "var(--color-royal)",
  },
  {
    id: 4,
    title: "Rain",
    subtitle: "Interactive Foggy Glass Wipe",
    tag: "EPISODE 04",
    image: STOCK.rainStreet,
    accent: "var(--color-steel)",
  },
  {
    id: 5,
    title: "Distance",
    subtitle: "India ➔ USA Live Clock & Flight Arc",
    tag: "EPISODE 05",
    image: STOCK.plane,
    accent: "var(--color-steel)",
  },
  {
    id: 6,
    title: "Things I Miss",
    subtitle: "Constellation of Memories",
    tag: "EPISODE 06",
    image: STOCK.stars,
    accent: "var(--color-lavender)",
  },
  {
    id: 7,
    title: "Behind The Scenes",
    subtitle: "Inside Jokes & 3 AM Coffee",
    tag: "EPISODE 07",
    image: STOCK.bar,
    accent: "var(--color-ember)",
  },
  {
    id: 8,
    title: "The Soundtrack",
    subtitle: "Vinyl Record of Our Song",
    tag: "EPISODE 08",
    image: STOCK.stars,
    accent: "var(--color-rose)",
  },
  {
    id: 9,
    title: "A Letter",
    subtitle: "A heartfelt thank you",
    tag: "EPISODE 09",
    image: STOCK.letter,
    accent: "var(--color-rose)",
  },
];

export default function NetflixHub({
  onPlayAll,
  onSelectChapter,
  visitedChapters = new Set(),
  directorsCutUnlocked = false,
  onDirectorsCut,
}: {
  onPlayAll: () => void;
  onSelectChapter: (id: number) => void;
  visitedChapters?: Set<number>;
  directorsCutUnlocked?: boolean;
  onDirectorsCut?: () => void;
}) {
  const [activeHover, setActiveHover] = useState<Chapter>(CHAPTERS[0]);

  return (
    <div className="relative min-h-screen bg-[#0B0B0D] text-white overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Dynamic Ambient Hero Backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[70vh] overflow-hidden pointer-events-none">
        <motion.div
          key={activeHover.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.45, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-cover bg-center filter blur-sm"
          style={{ backgroundImage: `url(${img(activeHover.image, 1600)})` }}
        />
        {/* Gradient Fades */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/40 via-[#0B0B0D]/80 to-[#0B0B0D]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-transparent to-[#0B0B0D]/80" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg sm:text-2xl tracking-widest text-purple-400 font-mono">
            A MEMORY SERIES<span className="text-white text-[10px] sm:text-xs ml-1 font-light tracking-normal opacity-60">ORIGINAL</span>
          </span>
        </div>
        <div className="text-[10px] sm:text-xs tracking-widest text-white/50 uppercase font-light">
          Shreya • Season 1
        </div>
      </header>

      {/* Hero Featured Card */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] sm:text-xs tracking-widest uppercase mb-4">
            <span className="size-2 rounded-full bg-purple-400 animate-pulse" />
            Limited Series • 9 Episodes
          </div>

          <h1 className="font-(family-name:--font-display) text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white mb-4">
            A Memory Series
          </h1>

          <p className="text-sm sm:text-lg text-white/70 font-light leading-relaxed mb-6 sm:mb-8">
            An interactive memory film celebrating our journey, rainy walks, late-night talks, and all the quiet moments in between.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onPlayAll}
              className="flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg shadow-white/10 text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">▶</span> Play Full Journey
            </button>
          </div>
        </motion.div>

        {/* Episode Carousel / Grid */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light tracking-wide text-white/90">
              Episodes & Chapters
            </h2>
            <span className="text-xs text-white/40 uppercase tracking-widest">
              Hover to preview • Click to play • {visitedChapters.size}/9 watched
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CHAPTERS.map((ch) => (
              <motion.div
                key={ch.id}
                onMouseEnter={() => setActiveHover(ch)}
                onClick={() => onSelectChapter(ch.id)}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="aspect-video w-full overflow-hidden relative">
                  <img
                    src={img(ch.image, 600)}
                    alt={ch.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono tracking-widest bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white/80 border border-white/10">
                    {ch.tag}
                  </span>
                  {/* Visited checkmark */}
                  {visitedChapters.has(ch.id) && (
                    <span className="absolute top-3 right-3 text-[10px] font-mono bg-purple-500/80 backdrop-blur-md px-2 py-1 rounded text-white border border-purple-400/30">
                      ✓
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-(family-name:--font-display) text-xl font-light text-white group-hover:text-purple-300 transition-colors">
                    {ch.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/50 font-light leading-relaxed">
                    {ch.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Director's Cut card */}
            <motion.div
              onClick={() => directorsCutUnlocked && onDirectorsCut?.()}
              whileHover={directorsCutUnlocked ? { y: -8, scale: 1.03 } : {}}
              transition={{ duration: 0.3 }}
              className={`group relative overflow-hidden rounded-xl border bg-white/5 backdrop-blur-md transition-all ${
                directorsCutUnlocked
                  ? "cursor-pointer border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/30"
                  : "cursor-not-allowed border-white/5 opacity-60"
              }`}
            >
              {/* Glow when unlocked */}
              {directorsCutUnlocked && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-transparent pointer-events-none"
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
              )}

              <div className="aspect-video w-full overflow-hidden relative bg-gradient-to-br from-purple-950 via-[#1a0a2e] to-black flex items-center justify-center">
                {directorsCutUnlocked ? (
                  <motion.span
                    className="text-4xl"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >🎞️</motion.span>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center px-4">
                    <span className="text-2xl opacity-40">🔒</span>
                    <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase">{visitedChapters.size}/9 episodes watched</p>
                  </div>
                )}
                <span className="absolute top-3 left-3 text-[10px] font-mono tracking-widest bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-purple-300">
                  DIRECTOR'S CUT
                </span>
              </div>

              <div className="p-5">
                <h3 className={`font-(family-name:--font-display) text-xl font-light transition-colors ${
                  directorsCutUnlocked ? "text-purple-300 group-hover:text-purple-200" : "text-white/30"
                }`}>
                  A Letter I Almost Didn't Write.
                </h3>
                <p className="mt-1 text-xs text-white/40 font-light leading-relaxed">
                  {directorsCutUnlocked ? "Unlocked · The final chapter" : "Watch all 9 episodes to unlock"}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

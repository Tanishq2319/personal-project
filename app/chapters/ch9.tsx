"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Backdrop, EASE, Line, Tint, TitleCard } from "../ui";
import { STOCK, img } from "../unsplash";

const ACCENT = "var(--color-rose)";
export const DURATION = 35;

export default function Ch9() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.5;
    const tryPlay = () => {
      void a.play().then(() => setPlaying(true)).catch(() => {});
    };
    const t = setTimeout(tryPlay, 800);
    return () => {
      clearTimeout(t);
      a.pause();
      a.currentTime = 0;
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void a.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <div className="relative h-full scroll-touch overflow-x-hidden bg-[#0B0B0D]">
      <Backdrop src={img(STOCK.stars)} opacity={0.3} blur={5} />
      <Tint color={ACCENT} strength={22} />

      <TitleCard label="Episode Nine" title="The Soundtrack" out={6} accent={ACCENT} />

      <div className="w-full max-w-xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 5.5, ease: EASE }}
          className="mx-auto rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl"
        >
          {/* Vinyl Disc Animation */}
          <motion.div
            className={`mx-auto size-44 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 p-2 shadow-2xl border border-white/20 relative grid place-items-center cursor-pointer transition-all ${playing ? "animate-spin [animation-duration:8s] hover:scale-105" : "hover:scale-105"}`}
            onClick={toggle}
          >
            {/* Grooves */}
            {[20, 35, 50, 65].map(r => (
              <div key={r} className="absolute rounded-full border border-white/5 pointer-events-none" style={{ width: r*2, height: r*2 }} />
            ))}
            
            {/* Label */}
            <div className="size-16 rounded-full bg-purple-900/60 border border-purple-400/40 grid place-items-center relative z-10 shadow-inner">
              <span className="size-4 rounded-full bg-[#0B0B0D] border border-white/20" />
            </div>
            
            {/* Play/Pause icon overlay on hover */}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity z-20">
              <span className="text-white text-3xl">{playing ? "⏸" : "▶"}</span>
            </div>
          </motion.div>

          <h3 className="mt-8 font-(family-name:--font-display) text-2xl text-white font-light">
            Our Rain & Late-Night Playlist
          </h3>
          <p className="mt-2 text-xs text-white/50 font-light">
            The songs that played in the background while we talked about everything.
          </p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-[13px] font-mono text-purple-300">
              {playing ? "▶ Now Playing:" : "⏸ Paused:"} <span className="font-bold text-white">Baarish Mein Phir</span>
            </p>
          </div>
          
          <audio ref={audioRef} src="/baarish.mp3" loop preload="auto" />
        </motion.div>
      </div>
    </div>
  );
}

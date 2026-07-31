"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Backdrop, EASE, Line, Polaroid, Tint, TitleCard, useParallax } from "../ui";
import { STOCK, img } from "../unsplash";

const ACCENT = "var(--color-steel)";
const TITLE_OUT = 6.5;
export const DURATION = 42;

function RainPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // Auto-play when chapter mounts (after user has already interacted with the page)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.5;
    const tryPlay = () => {
      void a.play().then(() => setPlaying(true)).catch(() => {});
    };
    // Small delay so the chapter transition finishes first
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: TITLE_OUT + 1, duration: 1 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 cursor-pointer select-none hover:border-blue-400/40 transition-all"
      onClick={toggle}
    >
      {/* Spinning vinyl disk */}
      <div
        className={`relative w-10 h-10 flex-shrink-0 transition-all ${playing ? "animate-spin [animation-duration:4s]" : ""}`}
      >
        <svg viewBox="0 0 40 40" className="w-full h-full">
          {/* Outer vinyl */}
          <circle cx="20" cy="20" r="19" fill="#1a1a2e" stroke="#7fb0c8" strokeWidth="0.5" />
          {/* Grooves */}
          {[6,9,12,15].map(r => (
            <circle key={r} cx="20" cy="20" r={r + 3} fill="none" stroke="#7fb0c8" strokeWidth="0.3" opacity="0.4" />
          ))}
          {/* Label */}
          <circle cx="20" cy="20" r="5" fill="#7fb0c8" opacity="0.8" />
          <circle cx="20" cy="20" r="1.5" fill="#0B0B0D" />
        </svg>
      </div>

      {/* Track info */}
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] font-mono font-bold text-white truncate">Baarish Mein Phir</span>
        <span className="text-[9px] font-mono text-white/40 truncate">Saahel · {playing ? "▶ Now Playing" : "⏸ Paused"}</span>
      </div>

      <audio ref={audioRef} src="/baarish.mp3" loop preload="auto" />
    </motion.div>
  );
}

export default function Ch4() {
  const [heavy, setHeavy] = useState(false);
  const { px, py } = useParallax(0.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wiped, setWiped] = useState(false);

  // Interactive Foggy Glass wiping effect + raindrop simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      drawFog();
    };

    window.addEventListener("resize", handleResize);

    // Initial fog layer
    const drawFog = () => {
      ctx.fillStyle = "rgba(12, 16, 26, 0.4)";
      ctx.fillRect(0, 0, width, height);
    };
    drawFog();

    // Wiping mechanism
    let isDrawing = false;

    const wipe = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      const gradient = ctx.createRadialGradient(x, y, 10, x, y, 70);
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      setWiped(true);
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      wipe(clientX, clientY);
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      onPointerMove(e);
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchstart", onPointerDown);
    window.addEventListener("touchmove", onPointerMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
    };
  }, []);

  return (
    <div
      onClick={() => setHeavy(true)}
      className="relative h-full scroll-touch overflow-x-hidden bg-[#0B0B0D]"
    >
      <RainPlayer />
      <Backdrop src={img(STOCK.rainStreet)} opacity={heavy ? 0.4 : 0.25} blur={wiped ? 2 : 12} />
      <Tint color={ACCENT} strength={heavy ? 28 : 16} />

      {/* Foggy glass canvas overlay */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-1000"
      />

      {/* Lightning-soft flash when heavy */}
      {heavy && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.16, 0, 0.09, 0] }}
          transition={{ duration: 1.6, times: [0, 0.1, 0.25, 0.35, 1] }}
          className="pointer-events-none absolute inset-0 z-20 bg-white"
        />
      )}

      <TitleCard label="Chapter Four" title="Rain" out={TITLE_OUT} accent={ACCENT} />

      <div className="w-full max-w-5xl mx-auto px-6 pt-24 pb-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.4, delay: TITLE_OUT - 0.8 }}
          className="relative z-0 grid w-full items-center gap-8 sm:gap-12 sm:grid-cols-2"
        >
        <motion.div style={{ x: px, y: py }} className="flex gap-6">
          <Polaroid
            src="/photos/rain-2.jpg"
            fallback={img(STOCK.rainStreet2, 700)}
            caption="the walk we didn't need"
            accent={ACCENT}
            tilt={2}
            className="w-full max-w-[280px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: TITLE_OUT + 3, ease: EASE }}
            className="hidden w-40 self-end sm:block"
          >
            <Polaroid
              src="/photos/rain-3.jpg"
              fallback={img(STOCK.rainWindow, 500)}
              accent="var(--color-navy)"
              tilt={-4}
            />
          </motion.div>
        </motion.div>

        <div className="space-y-7">
          <Line
            delay={TITLE_OUT + 1}
            className="font-(family-name:--font-display) text-3xl leading-snug font-light text-white/85 sm:text-4xl italic"
          >
            "remember one time we went into the rain and played there"
          </Line>
          <Line
            delay={TITLE_OUT + 3}
            className="font-(family-name:--font-display) text-2xl leading-snug font-light text-white/85 sm:text-3xl"
          >
            It started raining, and nobody suggested going home.
          </Line>
          <Line delay={TITLE_OUT + 5} className="text-lg font-light text-white/55">
            Everything was soaked and loud and completely fine.
          </Line>
          <Line delay={TITLE_OUT + 9} className="text-lg font-light text-white/55">
            You were laughing at how bad an idea it was, and still not leaving.
          </Line>
          <Line delay={TITLE_OUT + 13} className="text-lg font-light text-white/55">
            We didn't take many photos. I remember it in more detail than the ones we did.
          </Line>
          <Line
            delay={TITLE_OUT + 18}
            className="border-l border-(--color-steel)/50 pl-6 font-(family-name:--font-display) text-2xl font-light text-white/75"
          >
            <span className="block">
              Now every time it rains, I check whether you&apos;d have liked this one.
            </span>
          </Line>
          <Line
            delay={TITLE_OUT + 23}
            className="text-[10px] tracking-[0.4em] text-white/40 uppercase"
          >
            ✨ Move cursor or finger to wipe foggy glass • tap for heavy rain
          </Line>
        </div>
      </motion.div>
    </div>
  </div>
);
}


"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Backdrop, EASE, Line, Tint, TitleCard } from "../ui";
import { STOCK, img } from "../unsplash";

const ACCENT = "var(--color-lavender)";

interface MemoryStar {
  id: number;
  t: string;
  label: string;
  sub: string;
  c: string;
  x: number; // 0 - 100 percentage
  y: number; // 0 - 100 percentage
}

const THINGS: MemoryStar[] = [
  { id: 1, label: "Listening", t: "Listening to you.", sub: "Even the boring parts of your day.", c: "#c4b5fd", x: 15, y: 35 },
  { id: 2, label: "Rain walks", t: "Walking in the rain.", sub: "No umbrella, no plan, just us.", c: "#7fb0c8", x: 34, y: 20 },
  { id: 3, label: "Late memes", t: "Random memes.", sub: "Sent at 3 AM with zero context.", c: "#e0a56b", x: 64, y: 22 },
  { id: 4, label: "Deep talks", t: "Our conversations.", sub: "The ones that went nowhere and mattered most.", c: "#818cf8", x: 84, y: 36 },
  { id: 5, label: "Small details", t: "Those small moments.", sub: "The ones nobody would put in a photo.", c: "#d98fa8", x: 78, y: 72 },
  { id: 6, label: "Your smile", t: "Your smile.", sub: "The real one, not the photo one.", c: "#f0abfc", x: 50, y: 55 },
  { id: 7, label: "Your eyes", t: "Your eyes.", sub: "They always answered first.", c: "#a78bfa", x: 22, y: 72 },
  { id: 8, label: "Your care", t: "The way you cared.", sub: "Quietly, sincerely, and for everyone.", c: "#e879f9", x: 48, y: 84 },
];

// Constellation connecting lines index pairs
const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], // Top arc
  [3, 4], [4, 5], [5, 7], [7, 6], [6, 0], // Outer perimeter loop
  [1, 5], [2, 5], [6, 1]  // Inner web connectors
];

const TITLE_OUT = 6.5;
export const DURATION = 999;

export default function Ch6() {
  const [activeStar, setActiveStar] = useState<number | null>(null);
  const [explored, setExplored] = useState<Set<number>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  const handleStarClick = (idx: number) => {
    setActiveStar((prev) => (prev === idx ? null : idx));
    setExplored((prev) => new Set([...prev, idx]));
  };

  // Dynamic canvas for star flares, nebula background & constellation lines
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Background floating space dust particles
    const dust = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.0003 + 0.0001,
    }));

    function render(now: number) {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Render floating star dust
      dust.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = 1;
        ctx.save();
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(now * 0.002 + p.x * 10));
        ctx.fillStyle = "#c4b5fd";
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw constellation lines
      CONNECTIONS.forEach(([i1, i2]) => {
        const s1 = THINGS[i1];
        const s2 = THINGS[i2];
        const x1 = (s1.x / 100) * W;
        const y1 = (s1.y / 100) * H;
        const x2 = (s2.x / 100) * W;
        const y2 = (s2.y / 100) * H;

        const isExploredLine = explored.has(i1) && explored.has(i2);
        const isActiveLine = activeStar === i1 || activeStar === i2;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        if (isActiveLine) {
          ctx.strokeStyle = "#f0abfc";
          ctx.lineWidth = 2.5;
          ctx.shadowColor = "#f0abfc";
          ctx.shadowBlur = 14;
          ctx.globalAlpha = 0.9;
        } else if (isExploredLine) {
          ctx.strokeStyle = "#c4b5fd";
          ctx.lineWidth = 1.5;
          ctx.shadowColor = "#a78bfa";
          ctx.shadowBlur = 8;
          ctx.globalAlpha = 0.55;
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 6]);
          ctx.globalAlpha = 0.35;
        }
        ctx.stroke();
        ctx.restore();
      });

      // Canvas 4-point star flares for each star node
      THINGS.forEach((s, idx) => {
        const sx = (s.x / 100) * W;
        const sy = (s.y / 100) * H;
        const isActive = activeStar === idx;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.shadowColor = s.c;
        ctx.shadowBlur = isActive ? 22 : 12;

        // Radiant glow circle
        const radGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, isActive ? 28 : 18);
        radGlow.addColorStop(0, s.c);
        radGlow.addColorStop(1, "transparent");
        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(0, 0, isActive ? 28 : 18, 0, Math.PI * 2);
        ctx.fill();

        // 4-Point Star Rays
        ctx.strokeStyle = s.c;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.globalAlpha = isActive ? 0.9 : 0.6;
        const rayLen = isActive ? 18 : 12;
        ctx.beginPath();
        ctx.moveTo(-rayLen, 0); ctx.lineTo(rayLen, 0);
        ctx.moveTo(0, -rayLen); ctx.lineTo(0, rayLen);
        ctx.stroke();

        ctx.restore();
      });

      // Interactive laser beam connecting nearest star to mouse position
      if (mousePosRef.current) {
        const m = mousePosRef.current;
        THINGS.forEach((s) => {
          const sx = (s.x / 100) * W;
          const sy = (s.y / 100) * H;
          const dist = Math.hypot(m.x - sx, m.y - sy);
          if (dist < 200) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 200) * 0.45;
            ctx.strokeStyle = s.c;
            ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 5]);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      }

      raf = requestAnimationFrame(render);
    }

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [explored, activeStar]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = null;
  };

  return (
    <div className="relative grid h-full place-items-center px-6 overflow-hidden select-none bg-[#070712]">
      <Backdrop src={img(STOCK.stars)} opacity={0.25} blur={4} />
      <Tint color={activeStar !== null ? THINGS[activeStar].c : ACCENT} strength={18} />

      <TitleCard label="Chapter Six" title="Things I Miss" out={TITLE_OUT} accent={ACCENT} />

      {/* Main Interactive Constellation Map */}
      <div
        className="relative h-[82vh] w-full max-w-6xl rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setActiveStar(null)}
      >
        {/* Interactive Canvas layer for star flares & laser beams */}
        <canvas ref={canvasRef} className="absolute inset-0 size-full pointer-events-none" />

        {/* Top Floating HUD Tracker */}
        <div className="absolute top-6 left-6 z-30 flex items-center gap-4 bg-black/60 border border-white/15 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-xl">
          <span className="text-xl">✨</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-[0.3em] text-purple-300 uppercase">
              Constellation Memories
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {explored.size} / {THINGS.length} Explored
            </span>
          </div>
        </div>

        {/* Star Nodes */}
        {THINGS.map((th, i) => {
          const isOpen = activeStar === i;
          const isSeen = explored.has(i);
          const popoverAbove = th.y > 55;

          return (
            <div
              key={th.id}
              style={{ left: `${th.x}%`, top: `${th.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${isOpen ? "z-40" : "z-20"}`}
            >
              {/* Star Button with Large Hit Target */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStarClick(i);
                }}
                className="group relative flex flex-col items-center p-3 rounded-full cursor-pointer focus:outline-none"
                aria-label={`Memory ${i + 1}: ${th.t}`}
              >
                <motion.div
                  whileHover={{ scale: 1.35 }}
                  animate={{
                    scale: isOpen ? [1, 1.25, 1] : 1,
                  }}
                  transition={{ duration: 2, repeat: isOpen ? Infinity : 0, ease: "easeInOut" }}
                  className="relative grid size-10 place-items-center rounded-full bg-black/70 border border-white/50 backdrop-blur-md transition-all group-hover:border-purple-300 shadow-lg"
                >
                  {/* Glowing Outer Aura */}
                  <span
                    className="absolute inset-0 rounded-full blur-md opacity-70 transition-opacity group-hover:opacity-100"
                    style={{ background: th.c }}
                  />

                  {/* Inner Core Star Dot */}
                  <span
                    className="relative size-4 rounded-full shadow-lg"
                    style={{
                      background: th.c,
                      boxShadow: `0 0 16px 4px ${th.c}`,
                    }}
                  />

                  {/* Explored Checkmark Badge */}
                  {isSeen && (
                    <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 border border-black flex items-center justify-center text-[8px] font-bold text-black shadow-[0_0_8px_#34d399]">
                      ✓
                    </span>
                  )}
                </motion.div>

                {/* Subtitle Label Tag beneath star */}
                <span className="mt-1 text-[11px] font-mono tracking-wider text-white/70 group-hover:text-purple-300 bg-black/60 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm transition-colors pointer-events-none">
                  {th.label}
                </span>
              </button>

              {/* Memory Popover Card */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: popoverAbove ? -14 : 14, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: popoverAbove ? 10 : -10, scale: 0.95, filter: "blur(8px)" }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={`absolute left-1/2 w-72 -translate-x-1/2 z-50 rounded-2xl border border-purple-400/50 bg-[#0c0a1a]/95 p-5 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] pointer-events-auto ${
                      popoverAbove ? "bottom-full mb-3" : "top-full mt-3"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: th.c }} />
                        <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase">
                          Memory #{i + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveStar(null)}
                        className="text-white/40 hover:text-white text-xs font-mono p-1"
                      >
                        ✕
                      </button>
                    </div>

                    <h3 className="font-(family-name:--font-display) text-xl font-light text-white leading-snug">
                      {th.t}
                    </h3>
                    <p className="mt-2 text-xs font-mono text-purple-200/80 leading-relaxed">
                      {th.sub}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Footer Instruction */}
        <Line
          delay={TITLE_OUT + 1}
          className="absolute inset-x-0 bottom-5 text-center text-xs font-mono tracking-[0.3em] text-purple-300/60 uppercase pointer-events-none"
        >
          ✦ Click any star in the constellation to reveal a memory ✦
        </Line>
      </div>
    </div>
  );
}

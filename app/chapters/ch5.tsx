"use client";

import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Line, TitleCard } from "../ui";

const ACCENT = "var(--color-steel)";
const TITLE_OUT = 6.5;
export const DURATION = 65;

// Great-circle arc from India (Bangalore approx) to USA (NYC approx)
// We map these onto a simplified flat projection for our canvas
const INDIA = { x: 0.71, y: 0.49, name: "India", city: "Bangalore" };
const USA   = { x: 0.18, y: 0.36, name: "USA", city: "New York" };

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// Quadratic bezier point
function bezierPoint(t: number, p0x: number, p0y: number, p1x: number, p1y: number, p2x: number, p2y: number) {
  const mt = 1 - t;
  return {
    x: mt * mt * p0x + 2 * mt * t * p1x + t * t * p2x,
    y: mt * mt * p0y + 2 * mt * t * p1y + t * t * p2y,
  };
}

function bezierAngle(t: number, p0x: number, p0y: number, p1x: number, p1y: number, p2x: number, p2y: number) {
  const mt = 1 - t;
  const dx = 2 * (mt * (p1x - p0x) + t * (p2x - p1x));
  const dy = 2 * (mt * (p1y - p0y) + t * (p2y - p1y));
  return Math.atan2(dy, dx);
}

export default function Ch5() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [times, setTimes] = useState({ ist: "", usa: "", diff: "" });
  const [planeProgress, setPlaneProgress] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const FLIGHT_DELAY = TITLE_OUT + 18; // seconds from mount before plane starts
  const FLIGHT_DURATION = 18; // seconds for the flight

  // Live clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const ist = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      const usa = now.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      // Time diff
      const istH = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const usaH = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
      const diffMs = istH.getTime() - usaH.getTime();
      const diffH = Math.round(diffMs / 3600000);
      setTimes({ ist, usa, diff: `${diffH > 0 ? "+" : ""}${diffH}h ahead` });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Canvas star-map + flight path animation
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    startTimeRef.current = performance.now();
    let trailPoints: { x: number; y: number; age: number }[] = [];

    function draw(now: number) {
      const W = canvas.width;
      const H = canvas.height;
      const elapsed = (now - startTimeRef.current) / 1000; // seconds

      ctx.clearRect(0, 0, W, H);

      // ── Starfield ──
      ctx.save();
      const starSeed = 42;
      for (let i = 0; i < 160; i++) {
        const sx = ((Math.sin(i * 127.1 + starSeed) * 0.5 + 0.5) * W);
        const sy = ((Math.sin(i * 311.7 + starSeed) * 0.5 + 0.5) * H);
        const twinkle = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(now * 0.001 * (0.5 + (i % 7) * 0.3) + i));
        ctx.globalAlpha = twinkle * 0.6;
        ctx.fillStyle = i % 5 === 0 ? "#c4b5fd" : "#ffffff";
        ctx.beginPath();
        ctx.arc(sx, sy, i % 3 === 0 ? 1.2 : 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ── World map simplified lines (stylized continents as curved paths) ──
      const drawContinent = (paths: [number, number][][], color: string, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        paths.forEach(pts => {
          ctx.beginPath();
          ctx.moveTo(pts[0][0] * W, pts[0][1] * H);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0] * W, pts[i][1] * H);
          ctx.stroke();
        });
        ctx.restore();
      };

      // Simplified continent outlines (normalized 0-1 coords)
      // India subcontinent
      drawContinent([[
        [0.66, 0.37],[0.72, 0.35],[0.76, 0.38],[0.74, 0.44],[0.71, 0.50],[0.68, 0.53],
        [0.66, 0.49],[0.65, 0.43],[0.66, 0.37]
      ]], "#7fb0c8", 0.25);

      // USA outline (simplified)
      drawContinent([[
        [0.12, 0.28],[0.18, 0.26],[0.26, 0.27],[0.30, 0.30],[0.28, 0.36],[0.22, 0.40],
        [0.16, 0.40],[0.11, 0.37],[0.12, 0.28]
      ]], "#7fb0c8", 0.25);

      // UK/Europe hint
      drawContinent([[
        [0.44, 0.28],[0.47, 0.26],[0.50, 0.28],[0.49, 0.32],[0.46, 0.33],[0.44, 0.31],[0.44, 0.28]
      ]], "#7fb0c8", 0.12);

      // Latitude lines
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = "#7fb0c8";
      ctx.lineWidth = 0.5;
      for (let lat = 0.2; lat < 0.9; lat += 0.15) {
        ctx.beginPath();
        ctx.moveTo(0, lat * H);
        ctx.lineTo(W, lat * H);
        ctx.stroke();
      }
      // Longitude lines
      for (let lon = 0.1; lon < 1; lon += 0.1) {
        ctx.beginPath();
        ctx.moveTo(lon * W, 0);
        ctx.lineTo(lon * W, H);
        ctx.stroke();
      }
      ctx.restore();

      // ── Flight path + plane ──
      const p0x = INDIA.x * W;
      const p0y = INDIA.y * H;
      const p2x = USA.x * W;
      const p2y = USA.y * H;
      // Control point arcs upward (over the north Atlantic/Pacific)
      const p1x = lerp(p0x, p2x, 0.5);
      const p1y = Math.min(p0y, p2y) - H * 0.28;

      // Ghost full arc
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = "#c4b5fd";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(p0x, p0y);
      ctx.quadraticCurveTo(p1x, p1y, p2x, p2y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Animated flight section
      const flightStart = FLIGHT_DELAY;
      const t = Math.max(0, Math.min(1, (elapsed - flightStart) / FLIGHT_DURATION));
      setPlaneProgress(t);
      if (t >= 1 && !showStats) setShowStats(true);

      if (t > 0) {
        // Draw glowing trail
        const steps = 60;
        for (let s = 0; s < steps; s++) {
          const t0 = Math.max(0, t - (steps - s) / steps * 0.95);
          const t1 = Math.max(0, t - (steps - s - 1) / steps * 0.95);
          if (t1 <= 0) continue;
          const a0 = bezierPoint(t0, p0x, p0y, p1x, p1y, p2x, p2y);
          const a1 = bezierPoint(t1, p0x, p0y, p1x, p1y, p2x, p2y);
          const frac = s / steps;
          ctx.save();
          ctx.globalAlpha = frac * 0.7;
          ctx.strokeStyle = `hsl(${220 + frac * 60}, 80%, 75%)`;
          ctx.lineWidth = 1.5 + frac * 1.5;
          ctx.shadowColor = "#c4b5fd";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(a0.x, a0.y);
          ctx.lineTo(a1.x, a1.y);
          ctx.stroke();
          ctx.restore();
        }

        // Draw plane emoji at current position
        const pos = bezierPoint(t, p0x, p0y, p1x, p1y, p2x, p2y);
        const angle = bezierAngle(t, p0x, p0y, p1x, p1y, p2x, p2y);
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);
        // Glow halo
        ctx.shadowColor = "#c4b5fd";
        ctx.shadowBlur = 20;
        ctx.font = `${Math.max(20, W * 0.04)}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✈", 0, 0);
        ctx.restore();
      }

      // ── Location pins ──
      [INDIA, USA].forEach((loc, i) => {
        const px = loc.x * W;
        const py = loc.y * H;
        const pulse = 0.5 + 0.5 * Math.sin(now * 0.002 + i * Math.PI);

        // Ping rings
        for (let r = 1; r <= 3; r++) {
          ctx.save();
          ctx.globalAlpha = ((4 - r) / 4) * 0.3 * pulse;
          ctx.strokeStyle = "#c4b5fd";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, r * 10 * pulse + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Core dot
        ctx.save();
        ctx.shadowColor = "#c4b5fd";
        ctx.shadowBlur = 16;
        ctx.fillStyle = i === 0 ? "#7fb0c8" : "#c4b5fd";
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [FLIGHT_DELAY, FLIGHT_DURATION, showStats]);

  return (
    <div className="relative h-full flex flex-col scroll-touch overflow-x-hidden bg-[#07070F]">

      {/* Ambient top glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-[#0d1829] to-transparent opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(22,32,58,0.5),transparent)]" />
      </div>

      <TitleCard label="Chapter Five" title="Distance" out={TITLE_OUT} accent={ACCENT} />

      {/* World map canvas */}
      <div className="relative flex-1 w-full" style={{ minHeight: "55vh" }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* City labels overlaid */}
        <div className="absolute inset-0 pointer-events-none">
          {/* India label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: TITLE_OUT + 14, duration: 1 }}
            className="absolute"
            style={{ left: "70%", top: "52%", transform: "translate(-50%, 0)" }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase">Home</span>
              <span className="text-sm font-mono font-bold text-blue-300">Bangalore, India</span>
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 text-center mt-1">
                <span className="text-xs font-mono text-white/50 block">IST</span>
                <span className="text-base font-mono font-bold text-white tabular-nums">{times.ist || "--:--:--"}</span>
              </div>
            </div>
          </motion.div>

          {/* USA label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: TITLE_OUT + 14.5, duration: 1 }}
            className="absolute"
            style={{ left: "16%", top: "44%", transform: "translate(-50%, 0)" }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono tracking-[0.4em] text-purple-400 uppercase">Shreya ✦</span>
              <span className="text-sm font-mono font-bold text-purple-300">New York, USA</span>
              <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-lg px-3 py-1.5 text-center mt-1">
                <span className="text-xs font-mono text-white/50 block">EST</span>
                <span className="text-base font-mono font-bold text-purple-200 tabular-nums">{times.usa || "--:--:--"}</span>
              </div>
            </div>
          </motion.div>

          {/* Distance badge — appears mid-flight */}
          {planeProgress > 0.45 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
                <span className="text-lg">✈</span>
                <div className="text-center">
                  <span className="text-[10px] font-mono text-white/40 block">in the air</span>
                  <span className="text-xs font-mono font-bold text-white">13,800 km</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Time diff badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: TITLE_OUT + 15, duration: 1.5 }}
            className="absolute right-4 top-14 sm:right-6 sm:top-6 z-30"
          >
            <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-center">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-white/30 uppercase block mb-0.5">Time Gap</span>
              <span className="text-base sm:text-xl font-mono font-bold text-purple-300">9.5h</span>
              <span className="text-[9px] sm:text-[10px] font-mono text-white/30 block">IST ahead of EST</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Story text */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-16 text-center flex flex-col gap-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: TITLE_OUT + 7, duration: 1.5 }}
          className="text-3xl sm:text-4xl font-light text-white/80"
          style={{ fontFamily: "var(--font-display)" }}
        >
          26 July 2026
        </motion.div>

        <Line delay={TITLE_OUT + 9} className="font-light text-white/60 text-lg sm:text-xl" style={{ fontFamily: "var(--font-display)" }}>
          You left for your dreams.
        </Line>
        <Line delay={TITLE_OUT + 12} className="text-base font-light text-white/40">
          And the distance became real — not in kilometres, but in the hours you can&apos;t overlap.
        </Line>

        {/* Stats row — appears after plane lands */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: showStats ? 1 : 0, y: showStats ? 0 : 16 }}
          transition={{ duration: 1.2 }}
          className="flex items-center justify-center gap-6 mt-2 flex-wrap"
        >
          {[
            { label: "Flight Time", value: "~17h" },
            { label: "Distance", value: "13,800 km" },
            { label: "Time Apart", value: "9.5 hrs" },
            { label: "Timezone Gap", value: times.diff || "9.5h ahead" },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl px-5 py-3">
              <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">{s.label}</span>
              <span className="text-lg font-mono font-bold text-purple-200 mt-0.5">{s.value}</span>
            </div>
          ))}
        </motion.div>

        <Line delay={TITLE_OUT + 42} className="mt-4 font-light text-white/60 text-lg" style={{ fontFamily: "var(--font-display)" }}>
          You were right to go. That part was never in question.
        </Line>
        <Line delay={TITLE_OUT + 47} className="text-sm font-light text-white/30 tracking-wide">
          Different skies. Same memories.
        </Line>
      </div>
    </div>
  );
}

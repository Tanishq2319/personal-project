"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UNLOCK_KEY = "oyee_rain_unlocked";
const TARGET_SCORE = 20;
const LIVES = 7;

interface Drop {
  id: number;
  x: number;
  top: number;
  speed: number;
  size: number;
  special: boolean;
}

interface GameState {
  drops: Drop[];
  score: number;
  lives: number;
  paddleX: number;
  running: boolean;
  won: boolean;
  lost: boolean;
  dropId: number;
}

function freshState(): GameState {
  return { drops: [], score: 0, lives: LIVES, paddleX: 50, running: true, won: false, lost: false, dropId: 0 };
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerR: number, innerR: number) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
}

export default function RainGame({ onUnlock }: { onUnlock: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(freshState());
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const [display, setDisplay] = useState({ score: 0, lives: LIVES, won: false, lost: false });
  // gameKey === 0 means not yet started; incrementing it re-triggers the game loop useEffect
  const [gameKey, setGameKey] = useState(0);
  const [alreadyUnlocked, setAlreadyUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(UNLOCK_KEY) === "true") {
      setAlreadyUnlocked(true);
    }
  }, []);

  const isPlaying = gameKey > 0 && !display.won && !display.lost;

  const handlePointer = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    stateRef.current.paddleX = Math.max(8, Math.min(92, pct));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => handlePointer(e.clientX);
    const onTouch = (e: TouchEvent) => handlePointer(e.touches[0].clientX);
    const onKey = (e: KeyboardEvent) => {
      const gs = stateRef.current;
      if (e.key === "ArrowLeft") gs.paddleX = Math.max(8, gs.paddleX - 4);
      if (e.key === "ArrowRight") gs.paddleX = Math.min(92, gs.paddleX + 4);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("touchmove", onTouch); window.removeEventListener("keydown", onKey); };
  }, [handlePointer]);

  const triggerWin = useCallback(() => {
    stateRef.current.won = true;
    stateRef.current.running = false;
    localStorage.setItem(UNLOCK_KEY, "true");
    setDisplay(d => ({ ...d, won: true }));
    setTimeout(onUnlock, 5200);
  }, [onUnlock]);

  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current); // kill any stale loop before reset
    stateRef.current = freshState();
    lastSpawnRef.current = 0;
    lastFrameRef.current = 0;
    setDisplay({ score: 0, lives: LIVES, won: false, lost: false });
    setGameKey(k => k + 1); // increment to re-trigger useEffect
  }, []);

  useEffect(() => {
    if (gameKey === 0) return;
    const canvas = canvasRef.current!; // non-null: we returned above if null
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function spawnDrop(now: number) {
      const gs = stateRef.current;
      const interval = Math.max(620 - gs.score * 14, 260);
      if (now - lastSpawnRef.current < interval) return;
      lastSpawnRef.current = now;
      const special = Math.random() < 0.12;
      gs.drops.push({ id: gs.dropId++, x: 5 + Math.random() * 90, top: -24, speed: 1.9 + Math.random() * 1.4 + gs.score * 0.05, size: special ? 13 : 7 + Math.random() * 5, special });
    }

    function draw(now: number) {
      const gs = stateRef.current;
      if (!gs.running) return;
      const dt = Math.min(now - lastFrameRef.current, 50);
      lastFrameRef.current = now;
      const W = canvas.width; const H = canvas.height;
      const PADDLE_W = W * 0.19; const PADDLE_H = 13; const CATCH_Y = H - 64;
      const pxX = (gs.paddleX / 100) * W;
      spawnDrop(now);
      const survived: Drop[] = [];
      let scoreChanged = false; let lostLife = false;
      for (const d of gs.drops) {
        d.top += (d.speed * dt) / 16;
        const dropPx = (d.x / 100) * W;
        if (d.top >= CATCH_Y && d.top < CATCH_Y + 32 && Math.abs(dropPx - pxX) < PADDLE_W / 2 + d.size) {
          gs.score += d.special ? 3 : 1; scoreChanged = true;
          if (gs.score >= TARGET_SCORE) { triggerWin(); return; }
          continue;
        }
        if (d.top > H + 12) {
          gs.lives -= 1; lostLife = true;
          if (gs.lives <= 0) { gs.running = false; gs.lost = true; setDisplay(d2 => ({ ...d2, lives: 0, lost: true })); cancelAnimationFrame(rafRef.current); return; }
          continue;
        }
        survived.push(d);
      }
      gs.drops = survived;
      if (scoreChanged || lostLife) setDisplay({ score: gs.score, lives: gs.lives, won: false, lost: false });

      ctx.clearRect(0, 0, W, H);
      ctx.save(); ctx.globalAlpha = 0.06; ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 1;
      for (let i = 0; i < 28; i++) {
        const rx = (((i * 53 + now * 0.025) % W) + W) % W;
        const ry = (((i * 97 + now * 0.1) % H) + H) % H;
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 2, ry + 16); ctx.stroke();
      }
      ctx.restore();

      for (const d of gs.drops) {
        const dx = (d.x / 100) * W; const dy = d.top;
        ctx.save();
        if (d.special) {
          ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 22; ctx.fillStyle = "#fde68a";
          ctx.beginPath(); drawStar(ctx, dx, dy, 5, d.size, d.size * 0.45); ctx.fill();
        } else {
          ctx.shadowColor = "rgba(139,92,246,0.9)"; ctx.shadowBlur = 14;
          const g = ctx.createLinearGradient(dx, dy - d.size, dx, dy + d.size * 1.6);
          g.addColorStop(0, "#c4b5fd"); g.addColorStop(1, "#7c3aed"); ctx.fillStyle = g;
          ctx.beginPath(); ctx.moveTo(dx, dy - d.size * 1.4);
          ctx.bezierCurveTo(dx + d.size, dy - d.size * 0.3, dx + d.size, dy + d.size, dx, dy + d.size * 1.6);
          ctx.bezierCurveTo(dx - d.size, dy + d.size, dx - d.size, dy - d.size * 0.3, dx, dy - d.size * 1.4);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.save(); ctx.shadowColor = "rgba(168,85,247,0.8)"; ctx.shadowBlur = 20;
      const pg = ctx.createLinearGradient(pxX - PADDLE_W / 2, 0, pxX + PADDLE_W / 2, 0);
      pg.addColorStop(0, "#7c3aed"); pg.addColorStop(0.5, "#c084fc"); pg.addColorStop(1, "#7c3aed");
      ctx.fillStyle = pg; ctx.beginPath(); ctx.roundRect(pxX - PADDLE_W / 2, CATCH_Y, PADDLE_W, PADDLE_H, 6); ctx.fill(); ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(t => { lastFrameRef.current = t; draw(t); });
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [gameKey, triggerWin]); // gameKey changing restarts the whole loop

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080810] overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(109,40,217,0.18)_0%,_transparent_70%)] pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-mono tracking-[0.3em] text-purple-400 uppercase">a memory series</span>
          <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">— prologue —</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">score</span>
            <span className="text-xl font-mono font-bold text-purple-300 tabular-nums">{display.score}<span className="text-white/20 text-sm">/{TARGET_SCORE}</span></span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">lives</span>
            <span className="text-xl font-mono tracking-widest">{Array.from({ length: LIVES }).map((_, i) => (<span key={i} className={i < display.lives ? "text-pink-400" : "text-white/10"}>♥</span>))}</span>
          </div>
        </div>
        {alreadyUnlocked && (
          <button onClick={onUnlock} className="rounded-full border border-white/20 bg-white/5 px-5 py-1.5 text-xs font-mono tracking-widest text-white/50 uppercase backdrop-blur-md transition hover:border-purple-400 hover:text-white hover:bg-purple-950/50">Skip ➔</button>
        )}
      </div>
      <div className="relative z-10 mx-6 h-px bg-white/10 overflow-hidden rounded-full">
        <motion.div className="h-full bg-gradient-to-r from-purple-600 to-pink-500" style={{ boxShadow: "0 0 8px 2px rgba(168,85,247,0.5)" }} animate={{ width: `${(display.score / TARGET_SCORE) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
      </div>
      <div ref={containerRef} className={`relative flex-1 w-full overflow-hidden ${isPlaying ? "cursor-none" : "cursor-default"}`}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <AnimatePresence>
          {gameKey === 0 && !alreadyUnlocked && (
            <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-8 text-center px-8">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="text-6xl mb-4">🌧️</div>
                <h1 className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-wide mb-3">Catch the Rain</h1>
                <p className="text-sm font-mono text-white/50 max-w-xs leading-relaxed">Catch <span className="text-purple-300 font-bold">{TARGET_SCORE} raindrops</span> to unlock<br />the memories waiting inside.</p>
                <p className="mt-2 text-xs font-mono text-white/25 tracking-widest">✦ golden drops = 3 points ✦</p>
              </motion.div>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center gap-3">
                <p className="text-xs font-mono text-white/30 tracking-widest">move mouse · touch · arrow keys</p>
                <button onClick={startGame} className="group relative overflow-hidden rounded-full border border-purple-500/60 bg-purple-950/60 px-10 py-3 font-mono text-sm tracking-widest uppercase text-purple-200 backdrop-blur-md transition-all hover:border-purple-400 hover:bg-purple-900/80 hover:text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <span className="relative z-10">▶ Start</span>
                  <motion.span className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30" animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
                </button>
              </motion.div>
            </motion.div>
          )}
          {gameKey === 0 && alreadyUnlocked && (
            <motion.div key="welcome-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-8">
              <div className="text-5xl mb-2">🌟</div>
              <h1 className="font-mono text-2xl font-bold text-white tracking-wide">Welcome back.</h1>
              <p className="text-sm font-mono text-white/40 max-w-xs">You already braved the rain once.<br />The memories remember you.</p>
              <div className="flex gap-4 mt-2">
                <button onClick={startGame} className="rounded-full border border-white/20 bg-white/5 px-7 py-2.5 font-mono text-xs tracking-widest uppercase text-white/50 backdrop-blur-md transition hover:border-purple-400 hover:text-white hover:bg-purple-950/50">Play Again</button>
                <button onClick={onUnlock} className="rounded-full border border-purple-500/70 bg-purple-950/60 px-7 py-2.5 font-mono text-xs tracking-widest uppercase text-purple-200 backdrop-blur-md transition hover:bg-purple-900/80 hover:text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]">Enter ➔</button>
              </div>
            </motion.div>
          )}
          {display.lost && (
            <motion.div key="lost" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-8">
              <div className="text-5xl mb-2">☔</div>
              <h2 className="font-mono text-2xl font-bold text-white">Soaked.</h2>
              <p className="text-sm font-mono text-white/40">The rain won this round. Try again?</p>
              <p className="text-xs font-mono text-purple-400">You caught <span className="font-bold">{display.score}</span> / {TARGET_SCORE}</p>
              <button onClick={startGame} className="rounded-full border border-purple-500/60 bg-purple-950/60 px-9 py-3 font-mono text-sm tracking-widest uppercase text-purple-200 backdrop-blur-md transition hover:bg-purple-900/80 hover:text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]">Try Again</button>
            </motion.div>
          )}
          {display.won && (
            <motion.div
              key="won"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center px-8 overflow-hidden"
            >
              {/* Ambient glow pulse */}
              <motion.div
                className="absolute size-[500px] rounded-full bg-gradient-to-r from-purple-600/30 via-pink-500/20 to-indigo-600/30 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />

              {/* Staggered text lines */}
              <motion.div
                className="text-5xl sm:text-6xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: "backOut" }}
              >
                🎉
              </motion.div>

              <motion.p
                className="text-[11px] font-mono tracking-[0.5em] text-purple-400 uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Achievement Unlocked
              </motion.p>

              <motion.h2
                className="font-mono text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-300 to-purple-300 leading-tight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
              >
                Congratulations, Shreya.
              </motion.h2>

              <motion.p
                className="text-sm font-mono text-white/60 max-w-sm leading-relaxed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.6 }}
              >
                You caught the rain —{" "}
                <span className="text-purple-300">just like you always showed up</span>{" "}
                for every random, beautiful, unplanned moment.
              </motion.p>

              <motion.div
                className="w-24 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              />

              <motion.p
                className="text-xs font-mono text-white/30 tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.6 }}
              >
                The memories are now unlocking…
              </motion.p>

              {/* Sparkle dots */}
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-purple-300/50 text-sm pointer-events-none"
                  style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 20}%` }}
                  animate={{ y: [0, -18, 0], opacity: [0, 0.8, 0] }}
                  transition={{ delay: 0.3 + i * 0.25, duration: 2.2, repeat: Infinity, repeatDelay: 1 }}
                >
                  ✦
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {isPlaying && (
        <div className="relative z-10 py-3 text-center">
          <p className="text-[10px] font-mono tracking-widest text-white/15 uppercase">move cursor or use arrow keys to catch drops</p>
        </div>
      )}
    </div>
  );
}

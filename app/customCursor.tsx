"use client";

import { useEffect, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  vx: number;
  vy: number;
  born: number;
  life: number;
}

const COLORS = ["#c4b5fd", "#e879f9", "#818cf8", "#f0abfc", "#a78bfa"];

export default function CustomCursor({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const pidRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let lastSpawn = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawn > 30) {
        lastSpawn = now;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        particlesRef.current.push({
          id: pidRef.current++,
          x: e.clientX,
          y: e.clientY,
          size: 2.5 + Math.random() * 3,
          opacity: 0.85,
          color,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -0.5 - Math.random() * 1.2,
          born: now,
          life: 500 + Math.random() * 400,
        });
      }
    };

    window.addEventListener("mousemove", onMove);

    function loop(now: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => {
        const age = now - p.born;
        if (age > p.life) return false;
        const t = age / p.life;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // subtle gravity
        const alpha = (1 - t) * p.opacity;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.size * (1 - t * 0.5)), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

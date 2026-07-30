"use client";

import { useEffect, useRef } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  born: number;
}

export default function ClickRipple({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);
  const ridRef = useRef(0);

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

    const onClick = (e: MouseEvent) => {
      ripplesRef.current.push({ id: ridRef.current++, x: e.clientX, y: e.clientY, born: performance.now() });
    };
    window.addEventListener("click", onClick);

    const DURATION = 800;

    function loop(now: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ripplesRef.current = ripplesRef.current.filter(r => {
        const t = Math.max(0, Math.min(1, (now - r.born) / DURATION)); // clamp: rAF can fire slightly before born
        if (t >= 1) return false;
        const eased = 1 - Math.pow(1 - t, 3);
        const radius = Math.max(0, eased * 80);
        const alpha = (1 - t) * 0.5;

        // Outer expanding ring
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "#c4b5fd";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#a78bfa";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Inner smaller ring
        if (t < 0.6) {
          const r2 = Math.max(0, eased * 40);
          ctx.save();
          ctx.globalAlpha = alpha * 0.6;
          ctx.strokeStyle = "#e879f9";
          ctx.lineWidth = 1;
          ctx.beginPath();
          if (r2 > 0) ctx.arc(r.x, r.y, r2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Center dot flash
        if (t < 0.2) {
          ctx.save();
          ctx.globalAlpha = (0.2 - t) / 0.2;
          ctx.fillStyle = "#f0abfc";
          ctx.shadowColor = "#f0abfc";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        return true;
      });
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[199] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Pointer position in -0.5..0.5, spring-smoothed. Drives every parallax layer. */
export function useParallax(strength = 1) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 40, damping: 20 });
  const sy = useSpring(y, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return {
    px: useTransform(sx, (v) => v * 40 * strength),
    py: useTransform(sy, (v) => v * 40 * strength),
  };
}

/**
 * Soft light that trails the cursor. The system cursor stays visible — this is
 * atmosphere, not a replacement pointer. Transforms only: animating left/top
 * forces a layout recalc on every mouse move.
 */
export function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const gx = useSpring(x, { stiffness: 110, damping: 24, mass: 0.5 });
  const gy = useSpring(y, { stiffness: 110, damping: 24, mass: 0.5 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <>
      <motion.div
        style={{ x: gx, y: gy }}
        className="pointer-events-none fixed top-0 left-0 z-30 hidden will-change-transform sm:block"
      >
        <div className="size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-royal)_18%,transparent),transparent_60%)]" />
      </motion.div>
    </>
  );
}

/**
 * Dim photographic backdrop behind a chapter. Heavily darkened and blurred so
 * it reads as atmosphere, never as content, with a very slow push-in.
 */
export function Backdrop({
  src,
  opacity = 0.22,
  blur = 6,
}: {
  src: string;
  opacity?: number;
  blur?: number;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.img
        src={src}
        alt=""
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1.24, opacity }}
        transition={{ scale: { duration: 60, ease: "linear" }, opacity: { duration: 6 } }}
        className="size-full object-cover"
        style={{ filter: `blur(${blur}px) saturate(0.85)` }}
      />
      {/* keep text readable no matter what the photo does */}
      <div className="absolute inset-0 bg-linear-to-b from-(--color-ink)/85 via-(--color-ink)/70 to-(--color-ink)/90" />
    </div>
  );
}

/**
 * Per-chapter color wash. Fades in behind the content so each chapter has its
 * own temperature without touching the global aurora.
 */
export function Tint({
  color,
  delay = 0,
  strength = 22,
}: {
  color: string;
  delay?: number;
  strength?: number;
}) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: [1, 1.12, 1] }}
      transition={{
        opacity: { duration: 6, delay },
        scale: { duration: 26, repeat: Infinity, ease: "easeInOut" },
      }}
      className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
      style={{
        background: `radial-gradient(55% 45% at 50% 45%, color-mix(in oklab, ${color} ${strength}%, transparent), transparent 70%)`,
      }}
    />
  );
}

/** Title revealed one word at a time — slower, more deliberate than a single fade. */
export function WordReveal({
  text,
  delay = 0,
  per = 0.28,
  className = "",
}: {
  text: string;
  delay?: number;
  per?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2, delay: delay + i * per, ease: EASE }}
          className="inline-block"
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/** Cinematic chapter title card. Fades itself out so chapters need no state. */
export function TitleCard({
  label,
  title,
  date,
  out,
  accent = "var(--color-lavender)",
}: {
  label: string;
  title: string;
  date?: string;
  /** seconds the card is on screen before it has fully dissolved */
  out: number;
  accent?: string;
}) {
  const { px, py } = useParallax(0.5);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: out, times: [0, 0.18, 0.84, 1], ease: "easeInOut" }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
    >
      <motion.div style={{ x: px, y: py }} className="max-w-3xl w-full flex flex-col items-center">
        <div className="flex items-center gap-4">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
            className="h-px w-12 origin-left"
            style={{ background: accent }}
          />
          <p className="text-xs tracking-[0.5em] uppercase" style={{ color: accent, opacity: 0.7 }}>
            {label}
          </p>
        </div>

        <h1 className="mt-6 font-(family-name:--font-display) text-5xl sm:text-7xl md:text-8xl font-light text-white leading-none">
          <WordReveal text={title} delay={0.5} per={0.32} />
        </h1>

        {date && (
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 3, delay: 1.6, ease: EASE }}
            className="mt-8 text-sm font-light text-white/45 uppercase"
          >
            {date}
          </motion.p>
        )}
      </motion.div>
    </motion.section>
  );
}

/** A line of text that appears at `delay` and stays. */
export function Line({
  children,
  delay,
  className = "",
  style,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.8, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.p>
  );
}

/**
 * Polaroid frame. Drop real files into /public/photos/ using the `src` names in
 * the chapter data and they appear automatically; until then the frame shows a
 * soft gradient so layout and timing are already correct.
 */
export function Polaroid({
  src,
  fallback,
  caption,
  tilt = 0,
  accent = "var(--color-royal)",
  className = "",
}: {
  src?: string;
  /** stand-in photo shown until the real file exists at `src` */
  fallback?: string;
  caption?: string;
  tilt?: number;
  accent?: string;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, rotate: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{ rotate: `${tilt}deg` }}
      className={`rounded-sm bg-white/6 p-3 pb-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95)] ring-1 ring-white/10 backdrop-blur-md ${className}`}
    >
      <div
        className="relative aspect-4/5 overflow-hidden rounded-sm"
        style={{
          background: `linear-gradient(140deg, color-mix(in oklab, ${accent} 30%, transparent), rgba(255,255,255,0.04), color-mix(in oklab, var(--color-lavender) 14%, transparent))`,
        }}
      >
        {/* stand-in sits underneath; the real photo covers it once it loads */}
        {fallback && (
          <motion.img
            src={fallback}
            alt=""
            aria-hidden
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 14, ease: "linear" }}
            className="absolute inset-0 size-full object-cover opacity-70 saturate-[0.8]"
          />
        )}
        {src && (
          // eslint-disable-next-line @next/next/no-img-element -- missing files must fail soft, not throw
          <motion.img
            src={src}
            alt={caption ?? ""}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: "linear" }}
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-1000"
            onLoad={(e) => e.currentTarget.classList.replace("opacity-0", "opacity-100")}
          />
        )}
        {/* film grain */}
        <div className="grain pointer-events-none absolute inset-0" />
      </div>
      {caption && (
        <p className="mt-3 text-center font-(family-name:--font-display) text-sm text-white/55">
          {caption}
        </p>
      )}
    </motion.div>
  );
}

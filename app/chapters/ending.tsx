"use client";

import { motion } from "framer-motion";
import { Backdrop, EASE, Line, Tint } from "../ui";
import { CREDITS, STOCK, img } from "../unsplash";

export const DURATION = 34;

export default function Ending() {
  return (
    <div className="relative grid min-h-screen place-items-center px-6 text-center">
      <Backdrop src={img(STOCK.stars)} opacity={0.2} blur={5} />
      <Tint color="var(--color-royal)" strength={18} />

      <div className="space-y-10">
        <Line delay={2} className="text-lg leading-relaxed font-light text-white/45">
          That&apos;s all of it. Everything I could keep.
        </Line>

        <Line delay={7} className="text-xs tracking-[0.6em] text-white/40 uppercase">
          P.S.
        </Line>

        <motion.p
          initial={{ opacity: 0, scale: 1.12, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 4.5, delay: 11, ease: EASE }}
          className="font-(family-name:--font-display) text-6xl font-light text-white/90 sm:text-8xl"
        >
          Oyee.
        </motion.p>

        <Line delay={18} className="text-sm font-light text-white/30">
          (you know what that means)
        </Line>
      </div>

      {/* Unsplash photographer credits — required while stand-in photos are in use */}
      <Line
        delay={21}
        className="absolute bottom-8 px-6 text-[9px] leading-relaxed tracking-[0.2em] text-white/15 uppercase"
      >
        stand-in photography via Unsplash — {CREDITS.join(" · ")}
      </Line>

      {/* the stars swell one last time, then everything goes dark */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 14, delay: 8, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_50%_50%,color-mix(in_oklab,var(--color-lavender)_18%,transparent),transparent_70%)]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 8, delay: 24 }}
        className="pointer-events-none fixed inset-0 z-50 bg-(--color-ink)"
      />
    </div>
  );
}

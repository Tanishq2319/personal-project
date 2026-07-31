"use client";

import { motion } from "framer-motion";
import { Backdrop, EASE, Line, Tint, TitleCard, useParallax } from "../ui";
import { STOCK, img } from "../unsplash";

const ACCENT = "var(--color-rose)";

// Observations, not compliments. Each carries its own hue.
const CARDS = [
  {
    text: "You cared more than people realized.",
    sub: "Usually about things nobody was keeping score of.",
    color: "var(--color-rose)",
  },
  {
    text: "Purple somehow became your color.",
    sub: "Now I can't see it anywhere without a small delay in my day.",
    color: "var(--color-royal)",
  },
  {
    text: "Everyone saw the fun side. I noticed the caring one.",
    sub: "The quieter one. The one that checked if everybody got home.",
    color: "var(--color-lavender)",
  },
  {
    text: "Your eyes always stood out.",
    sub: "They gave away the mood before you said anything.",
    color: "var(--color-steel)",
  },
  {
    text: "Autumn reminds me of you.",
    sub: "Warm light, cold air, everything half-ending and still beautiful.",
    color: "var(--color-ember)",
  },
  {
    text: "Orchids remind me of you.",
    sub: "Delicate on the outside, far tougher than they look.",
    color: "var(--color-rose)",
  },
];

const TITLE_OUT = 6.5;
const STAGGER = 2.4;
export const DURATION = TITLE_OUT + CARDS.length * STAGGER + 9;

export default function Ch2() {
  const { px, py } = useParallax(0.25);

  return (
    <div className="relative h-full scroll-touch overflow-x-hidden bg-[#0B0B0D]">
      <Backdrop src={img(STOCK.orchid)} opacity={0.25} blur={6} />
      <Tint color={ACCENT} delay={TITLE_OUT - 2} strength={16} />

      <TitleCard label="Chapter Two" title="You" out={TITLE_OUT} accent={ACCENT} />

      <div className="w-full max-w-4xl mx-auto px-6 pt-24 pb-20">
        <Line
          delay={TITLE_OUT - 0.5}
          className="mb-10 text-center text-xs tracking-[0.4em] text-white/30 uppercase"
        >
          not compliments — things I noticed
        </Line>

        <motion.div style={{ x: px, y: py }} className="grid gap-5 sm:grid-cols-2">
          {CARDS.map((c, i) => {
            const at = TITLE_OUT + i * STAGGER;
            return (
              <motion.div
                key={c.text}
                initial={{ opacity: 0, y: 30, rotateX: -8, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                transition={{ duration: 2, delay: at, ease: EASE }}
                whileHover={{ y: -6, rotateY: 5, rotateX: -5, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md"
                style={{ transformPerspective: 900 }}
              >
                {/* the card's own colour, brightening on hover */}
                <div
                  className="absolute inset-0 -z-10 opacity-25 transition-opacity duration-700 group-hover:opacity-60"
                  style={{
                    background: `radial-gradient(80% 60% at 15% 0%, color-mix(in oklab, ${c.color} 40%, transparent), transparent 70%)`,
                  }}
                />
                <span
                  className="mb-5 block h-px w-8 origin-left transition-transform duration-700 group-hover:scale-x-[2.5]"
                  style={{ background: c.color }}
                />
                <p className="font-(family-name:--font-display) text-xl leading-relaxed font-light text-white/85">
                  {c.text}
                </p>
                <p className="mt-3 text-sm leading-relaxed font-light text-white/40">{c.sub}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <Line
          delay={TITLE_OUT + CARDS.length * STAGGER + 2}
          className="mt-12 text-center font-(family-name:--font-display) text-2xl font-light text-white/70"
        >
          None of this was ever about how you looked.
        </Line>
      </div>
    </div>
  );
}

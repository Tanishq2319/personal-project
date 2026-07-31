"use client";

import { motion } from "framer-motion";
import { Backdrop, EASE, Line, Tint, TitleCard, useParallax } from "../ui";
import { STOCK, img } from "../unsplash";

const ACCENT = "var(--color-ember)";

// A thank-you. Not a confession, not a request.
const LETTER = [
  "I'm not writing this to ask you for anything.",
  "I'm writing it because you were there for the part of my life I keep going back to.",
  "You showed up as a stranger somebody introduced, and somehow became the person I told things to first.",
  "You left for something bigger, and you were right to. I'd have been disappointed if you hadn't.",
  "Watching you go after it is its own kind of good news.",
  "Thank you for the mudcups, the rain, the terrible timing, and every conversation that ran too late.",
  "Thank you for being kind in the small ways that nobody was counting.",
  "None of it faded. I made sure of that — this whole thing is the proof.",
];

const TITLE_OUT = 6.5;
const PER = 4.8;
export const DURATION = TITLE_OUT + LETTER.length * PER + 16;

export default function Ch7() {
  const { px, py } = useParallax(0.2);

  return (
    <div className="relative grid h-full place-items-center px-6">
      <Backdrop src={img(STOCK.letter)} opacity={0.13} blur={9} />
      <Tint color={ACCENT} strength={12} />

      <TitleCard label="Chapter Seven" title="A Letter" out={TITLE_OUT} accent={ACCENT} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.4, delay: TITLE_OUT - 0.8, ease: EASE }}
        style={{ x: px, y: py }}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-10 backdrop-blur-md sm:p-14"
      >
        {/* warm light from the top-left corner of the page */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_10%_0%,color-mix(in_oklab,var(--color-ember)_16%,transparent),transparent_70%)]" />

        <Line delay={TITLE_OUT} className="mb-8 font-(family-name:--font-display) text-2xl font-light text-white/80">
          Shreya,
        </Line>

        <div className="space-y-6">
          {LETTER.map((l, i) => (
            <Line
              key={l}
              delay={TITLE_OUT + 1.5 + i * PER}
              className="text-lg leading-relaxed font-light text-white/70"
            >
              {l}
            </Line>
          ))}
        </div>

        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 3, delay: TITLE_OUT + LETTER.length * PER + 2, ease: EASE }}
          className="mt-10 mb-8 block h-px origin-left bg-linear-to-r from-(--color-ember)/60 to-transparent"
        />

        <Line
          delay={TITLE_OUT + LETTER.length * PER + 4}
          className="font-(family-name:--font-display) text-3xl font-light text-white/90"
        >
          Come back soon.
        </Line>
        <Line
          delay={TITLE_OUT + LETTER.length * PER + 8}
          className="mt-4 text-sm font-light text-white/35"
        >
          Whenever that is. I&apos;m not going anywhere.
        </Line>
      </motion.div>
    </div>
  );
}

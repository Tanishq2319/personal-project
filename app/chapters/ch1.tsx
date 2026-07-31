"use client";

import { motion } from "framer-motion";
import { Backdrop, EASE, Line, Tint, TitleCard, useParallax } from "../ui";
import { STOCK, img } from "../unsplash";

const ACCENT = "var(--color-ember)";

const BEATS = [
  {
    label: "A mutual friend",
    line: "Someone said your name in passing before I ever heard your voice.",
    sub: "An introduction that looked like nothing at the time — just another face in a crowded hallway.",
    detail: "I didn't know then that this single name would eventually carry so much weight.",
  },
  {
    label: "College Corridors",
    line: "The same stairs, the same background noise, a completely different reason to be there.",
    sub: "I started noticing which side of the room you sat on, which coffee you held, how you laughed.",
    detail: "Suddenly, college wasn't just about lectures anymore. It was about seeing if you'd show up.",
  },
  {
    label: "The First Real Conversation",
    line: "It started with a casual question and went on much longer than either of us planned.",
    sub: "Neither of us checked the time. Neither of us made an excuse to leave.",
    detail: "We talked about everything and nothing — the kind of effortless flow where hours slip away in minutes.",
  },
  {
    label: "22 March 2022",
    line: "The day everything unknowingly started.",
    sub: "No one announces the beginning of something important. You only recognise it long after.",
    detail: "If I could go back to that specific afternoon, I'd pause the clock right there.",
  },
  {
    label: "The Unspoken Habit",
    line: "After that day, saving a seat for you became second nature.",
    sub: "Walking together after class wasn't planned — it just started happening every single day.",
    detail: "We didn't call it anything. We just knew we preferred each other's company over anyone else's.",
  },
];

const TITLE_OUT = 7;
const PER_BEAT = 7.0;
const TOTAL_BEATS = BEATS.length * PER_BEAT;
export const DURATION = TITLE_OUT + TOTAL_BEATS + 8;

export default function Ch1() {
  const { px, py } = useParallax(0.35);

  return (
    <div className="relative h-full overflow-y-auto overflow-x-hidden bg-[#0B0B0D]">
      <Backdrop src={img(STOCK.autumn)} opacity={0.3} blur={4} />
      <Tint color={ACCENT} delay={TITLE_OUT - 2} strength={20} />

      <TitleCard
        label="Episode One"
        title="The Beginning"
        date="22 March 2022"
        out={TITLE_OUT}
        accent={ACCENT}
      />

      <div className="relative w-full max-w-3xl mx-auto px-6 pt-24 pb-16">
        <div className="absolute top-3 bottom-10 left-[calc(1.5rem+9px)] sm:left-[calc(1.5rem+9px)] w-px bg-white/10" />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: TOTAL_BEATS, delay: TITLE_OUT, ease: "linear" }}
          className="absolute top-3 bottom-10 left-[calc(1.5rem+9px)] w-px origin-top bg-linear-to-b from-(--color-ember) via-purple-500 to-(--color-lavender)"
        />

        {BEATS.map((b, i) => {
          const at = TITLE_OUT + i * PER_BEAT;
          return (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.8, delay: at, ease: EASE }}
              className="relative pb-16 pl-14 last:pb-0"
            >
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: at, ease: EASE }}
                className="absolute top-2 left-0 grid size-5 place-items-center rounded-full border border-purple-400/60 bg-black"
              >
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i }}
                  className="size-2 rounded-full bg-purple-400 shadow-[0_0_16px_var(--color-royal)]"
                />
              </motion.span>

              <h2 className="font-(family-name:--font-display) text-3xl font-light text-white sm:text-4xl">
                {b.label}
              </h2>
              <Line
                delay={at + 0.8}
                className="mt-3 max-w-lg text-lg leading-relaxed font-light text-white/80"
              >
                {b.line}
              </Line>
              <Line delay={at + 2.2} className="mt-2 max-w-lg text-sm font-light text-white/50 leading-relaxed">
                {b.sub}
              </Line>
              <Line delay={at + 4.0} className="mt-3 max-w-lg text-xs font-light text-purple-300/70 italic leading-relaxed border-l border-purple-500/30 pl-4">
                "{b.detail}"
              </Line>
            </motion.div>
          );
        })}

        <Line
          delay={TITLE_OUT + TOTAL_BEATS + 1}
          className="mt-12 pl-14 font-(family-name:--font-display) text-2xl font-light text-white/80"
        >
          Everything after this day was built on that one single afternoon.
        </Line>
      </div>
    </div>
  );
}


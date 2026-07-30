"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Backdrop, EASE, Polaroid, Tint, TitleCard, useParallax } from "../ui";
import { STOCK, img } from "../unsplash";

const ACCENT = "var(--color-lavender)";

// Drop matching files into /public/photos/ and they appear on their own.
const MEMORIES = [
  {
    title: "Mudcups",
    when: "the usual spot",
    stock: STOCK.cafe, src: "/photos/mudcups.jpg",
    story: "A tiny corner table, a cup of coffee that always got cold because we were talking.",
    story2: "We lost track of time here more than anywhere else. The staff stopped asking if we needed anything else because they knew we were staying past closing.",
    color: "var(--color-ember)",
  },
  {
    title: "VBHC",
    when: "an ordinary afternoon",
    stock: STOCK.cityNight2, src: "/photos/vbhc.jpg",
    story: "Nothing about this afternoon was planned or scheduled.",
    story2: "That's exactly why it's the one I replay in my head. Unscripted, effortless, and completely quiet.",
    color: "var(--color-lavender)",
  },
  {
    title: "College Fest",
    when: "loudest day of the year",
    stock: STOCK.cityNight, src: "/photos/fest.jpg",
    story: "Flashlights, music blasting, and hundreds of people moving in every direction.",
    story2: "Even in the middle of all that chaos, my eyes only searched for where you were standing.",
    color: "var(--color-royal)",
  },
  {
    title: "Rain Walks",
    when: "we should have waited it out",
    stock: STOCK.rainStreet, src: "/photos/rain.jpg",
    story: "There was dry shelter literally ten steps away under the canopy.",
    story2: "Neither of us walked towards it. We just kept walking in the downpour, laughing at how soaked we were getting.",
    color: "var(--color-steel)",
  },
  {
    title: "Gilly's",
    when: "terrible timing, great night",
    stock: STOCK.cafe2, src: "/photos/gillys.jpg",
    story: "A loud table, terrible noise levels, and the kind of uncontrollable laughter that makes your stomach hurt.",
    story2: "You always started laughing at your own joke halfway through telling it. You could never finish it with a straight face.",
    color: "var(--color-ember)",
  },
  {
    title: "Late Night Calls",
    when: "past 2 AM",
    stock: STOCK.bar2, src: "/photos/latenight.jpg",
    story: "Somewhere past midnight, the conversation stopped being about anything specific.",
    story2: "We talked about random memories, childhood fears, and silly thoughts. Neither of us wanted to say goodnight first.",
    color: "var(--color-royal)",
  },
  {
    title: "Selfies",
    when: "twenty takes",
    stock: STOCK.aurora, src: "/photos/selfies.jpg",
    story: "You took twenty photos, picked one, and deleted the rest on your phone.",
    story2: "I kept all of them. Even the blurry ones where we were mid-laugh. Especially those.",
    color: "var(--color-rose)",
  },
  {
    title: "Dark Bar",
    when: "low light",
    stock: STOCK.bar, src: "/photos/darkbar.jpg",
    story: "Soft yellow lights, a quiet corner booth, and a feeling like time had paused.",
    story2: "We didn't check our phones once the whole evening.",
    color: "var(--color-navy)",
  },
  {
    title: "Video Calls",
    when: "across time zones",
    stock: STOCK.planeWing, src: "/photos/videocall.jpg",
    story: "A small phone screen trying its best to bridge thousands of miles.",
    story2: "Laggy connection, weird time differences, but seeing your smile instantly made the distance disappear.",
    color: "var(--color-steel)",
  },
  {
    title: "The Unspoken Confession",
    when: "the hardest one",
    stock: STOCK.rainWindow, src: "/photos/confession.jpg",
    story: "I didn't say it like a movie script. I probably stumbled over my words.",
    story2: "But I meant every single syllable. And if I had to do it all over again, I'd say it the exact same way.",
    color: "var(--color-rose)",
  },
];

const TITLE_OUT = 6.5;
const PER = 7.5; // seconds per memory
export const DURATION = TITLE_OUT + MEMORIES.length * PER + 3;

export default function Ch3() {
  const [i, setI] = useState(-1);
  const { px, py } = useParallax(0.3);

  useEffect(() => {
    const start = setTimeout(() => setI(0), (TITLE_OUT - 0.5) * 1000);
    return () => clearTimeout(start);
  }, []);

  useEffect(() => {
    if (i < 0 || i >= MEMORIES.length - 1) return;
    const t = setTimeout(() => setI(i + 1), PER * 1000);
    return () => clearTimeout(t);
  }, [i]);

  const m = MEMORIES[i];

  return (
    <div className="relative grid min-h-screen place-items-center px-6">
      {m && <Backdrop key={`bd-${m.title}`} src={img(m.stock)} opacity={0.2} blur={10} />}
      <Tint color={m?.color ?? ACCENT} delay={0} strength={16} />

      <TitleCard label="Chapter Three" title="Our Moments" out={TITLE_OUT} accent={ACCENT} />

      <AnimatePresence mode="wait">
        {m && (
          <motion.div
            key={m.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: EASE }}
            style={{ x: px, y: py }}
            className="grid w-full max-w-4xl items-center gap-12 sm:grid-cols-[minmax(0,300px)_1fr]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 1.06, rotate: -3, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, rotate: -1.5, filter: "blur(0px)" }}
              transition={{ duration: 1.8, ease: EASE }}
            >
              <Polaroid
                src={m.src}
                fallback={img(m.stock, 700)}
                accent={m.color}
                caption={m.when}
              />
            </motion.div>

            <div>
              <div className="flex items-center gap-4">
                <span className="text-xs tracking-[0.4em] text-white/35 uppercase">
                  {String(i + 1).padStart(2, "0")} / {MEMORIES.length}
                </span>
                <motion.span
                  key={`bar-${m.title}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: PER, ease: "linear" }}
                  className="h-px w-24 origin-left"
                  style={{ background: m.color }}
                />
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
                className="mt-5 font-(family-name:--font-display) text-4xl font-light sm:text-6xl"
              >
                {m.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.6, delay: 1.1, ease: EASE }}
                className="mt-6 max-w-md text-lg leading-relaxed font-light text-white/65"
              >
                {m.story}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.6, delay: 2.6, ease: EASE }}
                className="mt-3 max-w-md text-base leading-relaxed font-light text-white/40"
              >
                {m.story2}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* filmstrip: where we are in the reel */}
      {i >= 0 && (
        <div className="absolute bottom-14 flex gap-1.5">
          {MEMORIES.map((mm, n) => (
            <motion.span
              key={mm.title}
              animate={{
                width: n === i ? 26 : 8,
                opacity: n === i ? 1 : n < i ? 0.5 : 0.18,
              }}
              transition={{ duration: 0.9, ease: EASE }}
              className="h-[3px] rounded-full"
              style={{ background: n <= i ? mm.color : "#fff" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}


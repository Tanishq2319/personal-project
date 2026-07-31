"use client";

import { motion } from "framer-motion";
import { Backdrop, EASE, Line, Tint, TitleCard, useParallax } from "../ui";
import { STOCK, img } from "../unsplash";

const ACCENT = "var(--color-ember)";

const MEMES = [
  { text: "3 AM Coffee Orders at Mudcups", caption: "Always extra sugar, always complaining it's late." },
  { text: "The 'Are you asleep?' texts", caption: "Spoiler: Neither of us was." },
  { text: "College fest chaos", caption: "Loud music, lost umbrellas, zero regrets." },
  { text: "The inside jokes nobody else got", caption: "One word and we'd lose it." },
  { text: "The Valentine's Day Disaster", caption: "Three girls. One guy. Infinite regret." },
  { text: "Gilly's Birthday Surprise", caption: "Still don't know how you planned it without me noticing." },
  { text: "VBHC Afternoon", caption: "The most unplanned, perfect silence." },
  { text: "Video Call Lag", caption: "Freezing mid-sentence with the worst possible facial expression." },
  { text: "Twenty Selfie Takes", caption: "You kept one, I kept the nineteen blurry ones." },
  { text: "The 'Just 5 More Minutes' Lie", caption: "Which always turned into another hour on the phone." },
];

export const DURATION = 35;

export default function Ch8() {
  const { px, py } = useParallax(0.3);

  return (
    <div className="relative h-full scroll-touch overflow-x-hidden bg-[#0B0B0D]">
      <Backdrop src={img(STOCK.bar)} opacity={0.25} blur={6} />
      <Tint color={ACCENT} strength={20} />

      <TitleCard label="Episode Eight" title="Behind The Scenes" out={6} accent={ACCENT} />

      <div className="w-full max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <Line delay={5.5} className="text-xs tracking-[0.4em] text-purple-400 uppercase mb-8">
          Top 10 Inside Jokes & Unfiltered Memories
        </Line>

        <motion.div style={{ x: px, y: py }} className="grid gap-6 sm:grid-cols-2">
          {MEMES.map((m, i) => (
            <motion.div
              key={m.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 6 + i * 1.5, ease: EASE }}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl hover:border-purple-400/40"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  SCENE 0{i + 1}
                </span>
              </div>
              <h3 className="font-(family-name:--font-display) text-xl text-white font-light">
                {m.text}
              </h3>
              <p className="mt-2 text-xs text-white/50 font-light leading-relaxed">
                {m.caption}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

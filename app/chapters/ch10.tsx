"use client";

import { motion } from "framer-motion";
import ScrollReveal from "../scrollReveal";

export const DURATION = 999;

const lines = [
  { text: "If you are reading this,", accent: false },
  { text: "it means you stayed.", accent: true },
  { text: "You went through every chapter.", accent: false },
  { text: "Every memory. Every moment.", accent: false },
  { text: "And I hope somewhere in between,", accent: false },
  { text: "you smiled.", accent: true },
];

const paragraphs = [
  {
    delay: 0,
    text: `This was never meant to be a grand gesture. No confessions, no speeches. Just a quiet thank you — the kind you owe someone who made ordinary days feel like something worth keeping.`,
  },
  {
    delay: 150,
    text: `You didn't have to be there for any of it. The mudcup runs. The rain walks. The 3 AM texts about nothing. But you were. And somehow that made everything feel less accidental.`,
  },
  {
    delay: 300,
    text: `I don't know what the next few years look like. You're in a different timezone now. Life moves. People move. But the moments — those don't go anywhere. They just sit quietly in the back, waiting for you to remember them.`,
  },
  {
    delay: 450,
    text: `So here they are. Collected, pressed like flowers between chapters, given back to you — in case you ever forget how good the ordinary was.`,
  },
];

export default function Ch10() {
  return (
    <div className="relative min-h-screen bg-[#07070F] text-white overflow-hidden flex flex-col items-center justify-start px-6 py-24">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 size-[400px] rounded-full bg-pink-900/10 blur-[100px]" />
      </div>

      {/* Film grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      <div className="relative z-10 max-w-2xl w-full mx-auto flex flex-col gap-16">

        {/* Title card */}
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-4">
            <span className="text-[10px] font-mono tracking-[0.6em] text-purple-400/70 uppercase">Director's Cut · Unlocked</span>
            <motion.div
              className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <h1 className="font-mono text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400 leading-tight">
              A Letter I Almost<br />Didn't Write.
            </h1>
            <span className="text-xs font-mono text-white/20 tracking-widest uppercase">For Shreya</span>
          </div>
        </ScrollReveal>

        {/* Opening poetic lines */}
        <ScrollReveal delay={100}>
          <div className="flex flex-col items-center gap-2 text-center">
            {lines.map((l, i) => (
              <ScrollReveal key={i} delay={i * 120} direction="none">
                <p className={`font-mono text-lg sm:text-xl leading-snug ${l.accent ? "text-purple-300 font-bold" : "text-white/50"}`}>
                  {l.text}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Divider */}
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-white/20 text-xs font-mono">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </ScrollReveal>

        {/* Main paragraphs */}
        <div className="flex flex-col gap-10">
          {paragraphs.map((p, i) => (
            <ScrollReveal key={i} delay={p.delay} direction="up">
              <p className="font-mono text-base sm:text-lg text-white/65 leading-[1.9] tracking-wide">
                {p.text}
              </p>
            </ScrollReveal>
          ))}
        </div>

        {/* Final sign-off */}
        <ScrollReveal delay={200}>
          <div className="flex flex-col items-center gap-6 text-center pt-8">
            <div className="flex items-center gap-4 w-full max-w-xs">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-400/30" />
              <span className="text-purple-400/60 text-xs">✦</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-400/30" />
            </div>

            <p className="font-mono text-white/30 text-sm italic leading-relaxed">
              "Not everything that mattered<br />was meant to be remembered.<br />
              But I'm glad we kept some of it."
            </p>

            <div className="flex flex-col items-center gap-1 mt-4">
              <span className="font-mono text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                Oyee.
              </span>
              <span className="text-[10px] font-mono tracking-[0.4em] text-white/20 uppercase">End of Series</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom credits */}
        <ScrollReveal delay={300}>
          <div className="text-center py-8 border-t border-white/5">
            <p className="text-[10px] font-mono tracking-widest text-white/15 uppercase">
              A Memory Series · Original · Season 1 · 2024
            </p>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}

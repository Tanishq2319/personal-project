"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import Opening from "./chapters/opening";
import Ch1, { DURATION as D1 } from "./chapters/ch1";
import Ch2, { DURATION as D2 } from "./chapters/ch2";
import Ch3, { DURATION as D3 } from "./chapters/ch3";
import Ch4, { DURATION as D4 } from "./chapters/ch4";
import Ch5, { DURATION as D5 } from "./chapters/ch5";
import Ch6, { DURATION as D6 } from "./chapters/ch6";
import Ch8, { DURATION as D8 } from "./chapters/ch8";
import Ch9, { DURATION as D9 } from "./chapters/ch9";
import Ch7, { DURATION as D7 } from "./chapters/ch7";
import Ending, { DURATION as DE } from "./chapters/ending";
import Ch10, { DURATION as D10 } from "./chapters/ch10";
import NetflixIntro from "./netflixIntro";
import NetflixHub from "./netflixHub";
import NetflixPlayerControls from "./netflixPlayerControls";
import RainGame from "./rainGame";
import AchievementToasts, { unlockAchievement, isUnlocked } from "./achievementSystem";
import CustomCursor from "./customCursor";
import ClickRipple from "./clickRipple";

const VISITED_KEY = "oyee_visited";
const TOTAL_CHAPTERS = 9; // chapters 1-9 must be visited to unlock Director's Cut

function getVisited(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(VISITED_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveVisited(s: Set<number>) {
  localStorage.setItem(VISITED_KEY, JSON.stringify([...s]));
}

const SCENES = [
  { el: <Ch1 />, s: D1 },
  { el: <Ch2 />, s: D2 },
  { el: <Ch3 />, s: D3 },
  { el: <Ch4 />, s: D4 },
  { el: <Ch5 />, s: D5 },
  { el: <Ch6 />, s: D6 },
  { el: <Ch8 />, s: D8 },
  { el: <Ch9 />, s: D9 },
  { el: <Ch7 />, s: D7 },
  { el: <Ending />, s: DE },
];

export default function Sequence() {
  const [step, setStep] = useState(-3);
  // -3=RainGame, -2=NetflixIntro, -1=Hub, 0=Opening, 1-9=Chapters, 10=Director's Cut
  const [egg, setEgg] = useState(false);
  const [visited, setVisited] = useState<Set<number>>(getVisited);
  const directorsCutUnlocked = visited.size >= TOTAL_CHAPTERS;

  const i = step - 1;
  const scene = SCENES[i];

  // Track chapter visits + fire achievements
  const markVisited = useCallback((chId: number) => {
    setVisited(prev => {
      if (prev.has(chId)) return prev;
      const next = new Set(prev);
      next.add(chId);
      saveVisited(next);
      // Per-chapter achievements
      if (chId === 1) unlockAchievement("first_chapter");
      if (chId === 3) unlockAchievement("rain_walker");
      if (chId === 4) unlockAchievement("distance");
      if (chId === 7) unlockAchievement("behind_scenes");
      if (chId === 8) unlockAchievement("soundtrack");
      if (next.size === 5) unlockAchievement("halfway");
      if (next.size >= TOTAL_CHAPTERS) unlockAchievement("completionist");
      return next;
    });
  }, []);

  // Fire markVisited whenever a numbered chapter becomes active
  useEffect(() => {
    if (step >= 1 && step <= 9) markVisited(step);
  }, [step, markVisited]);

  // auto-advance when in full journey mode
  useEffect(() => {
    if (step <= 0 || !scene || i >= SCENES.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), scene.s * 1000);
    return () => clearTimeout(t);
  }, [step, i, scene]);

  // easter egg: type "oiiii" anywhere
  useEffect(() => {
    let buf = "";
    const onKey = (e: KeyboardEvent) => {
      buf = (buf + e.key.toLowerCase()).slice(-5);
      if (buf === "oiiii") {
        setEgg(true);
        setTimeout(() => setEgg(false), 5000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Konami code easter egg → achievement
  useEffect(() => {
    const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI[idx]) {
        idx++;
        if (idx === KONAMI.length) { unlockAchievement("konami"); idx = 0; }
      } else { idx = 0; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0"
        >
          {step === -3 ? (
            <RainGame onUnlock={() => setStep(0)} />
          ) : step === -2 ? (
            <NetflixIntro onComplete={() => setStep(-1)} />
          ) : step === -1 ? (
            <NetflixHub
              onPlayAll={() => setStep(1)}
              onSelectChapter={(chId) => setStep(chId)}
              visitedChapters={visited}
              directorsCutUnlocked={directorsCutUnlocked}
              onDirectorsCut={() => { unlockAchievement("directors_cut"); setStep(10); }}
            />
          ) : step === 0 ? (
            <Opening onBegin={() => {
              if (typeof window !== "undefined") window.dispatchEvent(new Event("start-music"));
              setStep(-2);
            }} />
          ) : step === 10 ? (
            <Ch10 />
          ) : (
            scene?.el
          )}
        </motion.div>
      </AnimatePresence>

      {/* Clean minimal floating navigation during active chapters */}
      {step > 0 && (
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-3">
          <button
            onClick={() => setStep(-1)}
            className="rounded-full border border-white/20 bg-black/80 px-3.5 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-widest uppercase text-white backdrop-blur-md transition-all hover:border-purple-400 hover:bg-purple-950/80 shadow-lg"
          >
            ☰ Hub
          </button>
        </div>
      )}

      {step > 0 && (
        <>
          {/* chapter progress */}
          <div className="fixed top-4 sm:top-6 left-1/2 z-40 flex -translate-x-1/2 gap-1.5 sm:gap-2">
            {SCENES.map((_, n) => (
              <span
                key={n}
                className={`h-px w-3.5 sm:w-6 transition-colors duration-700 ${
                  n <= i ? "bg-(--color-lavender)/80" : "bg-white/15"
                }`}
              />
            ))}
          </div>

          {/* let her move on early if she wants */}
          {i < SCENES.length - 1 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-40 text-[10px] sm:text-xs tracking-[0.3em] text-white/35 uppercase transition-colors duration-500 hover:text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10"
            >
              next ➔
            </button>
          )}
        </>
      )}

      <Music />
      <AchievementToasts />
      {/* Custom cursor — disabled during rain game which controls its own cursor */}
      <CustomCursor active={step !== -3} />
      <ClickRipple active={step !== -3} />

      <AnimatePresence>
        {egg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-(--color-lavender)/40 bg-white/5 px-6 py-3 font-(family-name:--font-display) text-lg backdrop-blur-md"
          >
            I heard you.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Music() {
  const ref = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const start = () => {
      const a = ref.current;
      if (a && a.paused) {
        a.volume = 0.35;
        void a.play().catch(() => {});
        setOn(true);
      }
    };
    window.addEventListener("start-music", start);
    return () => window.removeEventListener("start-music", start);
  }, []);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (on) {
      a.pause();
    } else {
      a.volume = 0.35;
      void a.play().catch(() => {});
    }
    setOn(!on);
  };

  return (
    <>
      <audio ref={ref} src="/those_eyes.mp3" loop preload="none" />
      <button
        onClick={toggle}
        className="fixed bottom-6 left-6 z-40 text-xs tracking-[0.3em] text-white/30 uppercase transition-colors duration-500 hover:text-white/70"
      >
        {on ? "music off" : "music on"}
      </button>
    </>
  );
}


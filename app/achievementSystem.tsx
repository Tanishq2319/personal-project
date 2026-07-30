"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  color?: string; // tailwind gradient classes for the accent
}

// ─── Pre-defined achievements ────────────────────────────────────────────────
export const ACHIEVEMENTS: Record<string, Achievement> = {
  first_chapter: {
    id: "first_chapter",
    icon: "🎬",
    title: "First Memory",
    description: "You opened Chapter 1. It begins.",
    color: "from-purple-500 to-indigo-500",
  },
  rain_walker: {
    id: "rain_walker",
    icon: "🌧️",
    title: "Rain Walker",
    description: "You revisited the rain. Some things never change.",
    color: "from-blue-500 to-purple-500",
  },
  halfway: {
    id: "halfway",
    icon: "⚡",
    title: "Halfway There",
    description: "5 episodes in. She's invested.",
    color: "from-yellow-500 to-orange-500",
  },
  behind_scenes: {
    id: "behind_scenes",
    icon: "🎭",
    title: "Behind The Curtain",
    description: "You found the inside jokes chapter.",
    color: "from-pink-500 to-rose-500",
  },
  soundtrack: {
    id: "soundtrack",
    icon: "🎵",
    title: "Now Playing",
    description: "The vinyl is spinning.",
    color: "from-emerald-500 to-teal-500",
  },
  completionist: {
    id: "completionist",
    icon: "🏆",
    title: "Completionist",
    description: "All 9 episodes watched. Director's Cut unlocked.",
    color: "from-yellow-400 to-amber-500",
  },
  konami: {
    id: "konami",
    icon: "🕹️",
    title: "Gamer Detected",
    description: "You know the code. Of course you do.",
    color: "from-green-400 to-emerald-500",
  },
  distance: {
    id: "distance",
    icon: "✈️",
    title: "Miles Apart",
    description: "You opened the Distance chapter.",
    color: "from-sky-500 to-blue-500",
  },
  directors_cut: {
    id: "directors_cut",
    icon: "🎞️",
    title: "Director's Cut",
    description: "The final chapter. The one that matters most.",
    color: "from-purple-400 to-pink-400",
  },
};

// ─── Global event helpers ─────────────────────────────────────────────────────
const STORAGE_KEY = "oyee_achievements";

let nextToastId = 0;

export function unlockAchievement(id: string) {
  if (typeof window === "undefined") return;
  const unlocked: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (unlocked.includes(id)) return; // already unlocked — don't toast again
  unlocked.push(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent("oyee:achievement", { detail: id }));
  }, 0);
}

export function isUnlocked(id: string): boolean {
  if (typeof window === "undefined") return false;
  const unlocked: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return unlocked.includes(id);
}

// ─── Toast Component ──────────────────────────────────────────────────────────
interface Toast { id: string; achievement: Achievement }

export default function AchievementToasts() {
  const [queue, setQueue] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const achievement = ACHIEVEMENTS[id];
      if (!achievement) return;
      const toastId = `${Date.now()}_${++nextToastId}_${Math.random().toString(36).substring(2, 7)}`;
      setQueue(q => [...q, { id: toastId, achievement }]);
      setTimeout(() => setQueue(q => q.filter(t => t.id !== toastId)), 4500);
    };
    window.addEventListener("oyee:achievement", handler);
    return () => window.removeEventListener("oyee:achievement", handler);
  }, []);

  return (
    <div className="fixed bottom-20 right-6 z-[100] flex flex-col gap-3 items-end pointer-events-none">
      <AnimatePresence>
        {queue.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl px-4 py-3 shadow-2xl min-w-[260px] max-w-[300px] overflow-hidden"
          >
            {/* Accent gradient bar on left */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b ${toast.achievement.color ?? "from-purple-500 to-pink-500"}`} />

            {/* Icon */}
            <span className="text-2xl pl-1 shrink-0">{toast.achievement.icon}</span>

            {/* Text */}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[9px] font-mono tracking-[0.4em] text-white/40 uppercase">Achievement Unlocked</span>
              <span className="text-sm font-mono font-bold text-white truncate">{toast.achievement.title}</span>
              <span className="text-[11px] font-mono text-white/50 leading-snug">{toast.achievement.description}</span>
            </div>

            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.8, delay: 0.1 }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
